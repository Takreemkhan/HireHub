import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ isUnique: true }); // Ignore too short
  }

  try {
    const db = (await clientPromise).db(DB_NAME);
    const existing = await db.collection(COLLECTIONS.BUSINESS_PAGES).findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    return NextResponse.json({ isUnique: !existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
