import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

export async function GET(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const params = await context.params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const contact = await db
      .collection(COLLECTIONS.CONTACTS)
      .findOne({ userId: new ObjectId(params.id) });

    return NextResponse.json({ success: true, contact: contact || null }, { status: 200 });
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const params = await context.params;

    if (auth.userId !== params.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
console.log("Received contact update:", body);
    const updateFields = {};
    if (body.phone !== undefined)    updateFields.phone = body.phone;
    if (body.companyName !== undefined) updateFields.companyName = body.companyName;
    
    if (body.country !== undefined)  updateFields["location.country"]  = body.country;
    if (body.address !== undefined)  updateFields["location.address"]  = body.address;
    if (body.address2 !== undefined) updateFields["location.address2"] = body.address2;
    if (body.city !== undefined)     updateFields["location.city"]     = body.city;
    if (body.state !== undefined)    updateFields["location.state"]    = body.state;
    if (body.zipCode !== undefined)  updateFields["location.zipCode"]  = body.zipCode;
    updateFields.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updatedContact = await db
      .collection(COLLECTIONS.CONTACTS)
      .findOneAndUpdate(
        { userId: new ObjectId(params.id) },
        {
          $set: updateFields,
          $setOnInsert: {
            userId: new ObjectId(params.id),
            role: body.role || "freelancer",
            createdAt: new Date(),
          },
        },
        { upsert: true, returnDocument: "after" }
      );
console.log("CONTACTS:", COLLECTIONS.CONTACTS);
    return NextResponse.json(
      { success: true, message: "Contact updated successfully", contact: updatedContact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact PUT error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}