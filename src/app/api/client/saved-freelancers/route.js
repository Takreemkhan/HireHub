import { NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { toggleSavedFreelancer, getSavedFreelancers } from "@/app/controllers/saved-freelancers.controller";

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated || (auth.token?.role !== "client" && auth.token?.role !== "EMPLOYEE")) {
            return unauthorizedResponse(auth.error || "Must be client");
        }

        const url = new URL(req.url);
        const idsOnly = url.searchParams.get("idsOnly") === "true";

        if (idsOnly) {
            const dbRef = await import("@/lib/mongodb");
            const dbName = dbRef.DB_NAME;
            const colls = dbRef.COLLECTIONS;
            const client = await dbRef.default;
            const ObjectId = (await import("mongodb")).ObjectId;
            const user = await client.db(dbName).collection(colls.USERS).findOne({ _id: new ObjectId(auth.userId) });
            const ids = (user?.savedFreelancers || []).map(id => id.toString());
            return NextResponse.json({ success: true, count: ids.length, ids });
        }

        const freelancers = await getSavedFreelancers(auth.userId);

        return NextResponse.json({ success: true, count: freelancers.length, freelancers });
    } catch (error) {
        console.error("GET /api/client/saved-freelancers Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch saved freelancers." },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated || (auth.token?.role !== "client" && auth.token?.role !== "EMPLOYEE")) {
            return unauthorizedResponse(auth.error || "Must be client");
        }

        const body = await req.json();
        if (!body.freelancerId) {
            return NextResponse.json({ success: false, message: "freelancerId is required" }, { status: 400 });
        }

        const result = await toggleSavedFreelancer(auth.userId, body.freelancerId);

        return NextResponse.json({ success: true, isSaved: result.isSaved });
    } catch (error) {
        console.error("POST /api/client/saved-freelancers Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to toggle save status." },
            { status: 500 }
        );
    }
}
