import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessId } = await params;
    const db = (await clientPromise).db(DB_NAME);
    const page = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .findOne({ _id: new ObjectId(businessId) });

    if (!page) {
      return NextResponse.json({ error: "Business page not found" }, { status: 404 });
    }

    // Security: only the owner or admin can view
    const isOwner = page.ownerId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      businessPage: { ...page, _id: page._id.toString(), ownerId: page.ownerId.toString() },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessId } = await params;
    const db = (await clientPromise).db(DB_NAME);
    const page = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .findOne({ _id: new ObjectId(businessId) });

    if (!page || page.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowedFields: Record<string, any> = { updatedAt: new Date() };
    if (body.logo !== undefined) allowedFields.logo = body.logo;

    await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .updateOne({ _id: new ObjectId(businessId) }, { $set: allowedFields });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessId } = await params;
    const db = (await clientPromise).db(DB_NAME);
    const page = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .findOne({ _id: new ObjectId(businessId) });

    if (!page || page.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 });
    }

    // Soft-delete
    await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .updateOne(
        { _id: new ObjectId(businessId) },
        { $set: { isActive: false, updatedAt: new Date() } }
      );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
