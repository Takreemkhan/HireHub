import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const users = await db
      .collection(COLLECTIONS.USERS)
      .find({ role: { $in: ["client", "freelancer"] } })
      .sort({ createdAt: -1 })
      .toArray();

    if (!users.length) return NextResponse.json({ success: true, data: [] });

    const userIds = users.map((u) => u._id);

    const documents = await db
      .collection(COLLECTIONS.FILES)
      .find({ userId: { $in: userIds } })
      .sort({ uploadedAt: -1, createdAt: -1 })
      .toArray();

    const settingsList = await db
      .collection(COLLECTIONS.SETTINGS)
      .find({ userId: { $in: userIds } })
      .toArray();

    // userId → latest document map
    const docMap = {};
    for (const doc of documents) {
      const key = doc.userId.toString();
      if (!docMap[key]) docMap[key] = doc;
    }

    const settingsMap = {};
    for (const s of settingsList) {
      settingsMap[s.userId?.toString()] = s;
    }

    // documentType enum → readable label
    const docTypeMap = {
      aadhar:           "Aadhar Card",
      pan:              "PAN Card",
      passport:         "Passport",
      driving_license:  "Driving License",
      voter_id:         "Voter ID",
      bank_statement:   "Bank Statement",
      other:            "Other",
    };

    const getDocTypeLabel = (doc) => {
      if (!doc) return "No Document";
      // ✅ Pehle documentType field check karo (naye uploads mein hoga)
      if (doc.documentType && docTypeMap[doc.documentType]) {
        return docTypeMap[doc.documentType];
      }
      // Agar documentType field hai lekin map mein nahi
      if (doc.documentType) return doc.documentType;
      // Fallback: mime type se guess (purane records ke liye)
      const mime = doc.fileType || "";
      if (mime.includes("pdf"))   return "PDF Document";
      if (mime.includes("image")) return "Image Document";
      return "Document";
    };

    const data = users.map((u) => {
      const userId   = u._id.toString();
      const doc      = docMap[userId];
      const settings = settingsMap[userId];

      const contact = settings?.phone || settings?.mobile || u.phone || u.contact || u.mobile || "—";

      let documentStatus = "Pending";
      if (doc?.verificationStatus === "approved") documentStatus = "Verified";
      else if (doc?.verificationStatus === "rejected") documentStatus = "Rejected";

      let uploadDate = "—";
      if (doc?.uploadedAt || doc?.createdAt) {
        uploadDate = new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        });
      }

      return {
        id:               userId,
        name:             u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
        email:            u.email,
        contact,
        role:             u.role,
        avatar:           (u.name || u.firstName || "U")[0].toUpperCase(),
        joinedDate:       u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "—",
        documentId:       doc?._id?.toString() || null,
        documentType:     getDocTypeLabel(doc),      // ✅ sahi label
        documentStatus,
        documentUrl:      doc?.url || null,
        rejectionReason:  doc?.rejectionReason || null,
        uploadDate,
        hasDocument:      !!doc,
        isBlocked:        u.isBlocked || false,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}