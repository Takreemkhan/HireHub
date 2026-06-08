import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ── helpers ──────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getFreelancerPlanLimit(db: any, userId: string): Promise<number> {
  const sub = await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).findOne(
    {
      $or: [
        { freelancerId: userId },
        { userId: new ObjectId(userId) }
      ]
    },
    { sort: { createdAt: -1 } }
  );
  
  if (sub?.planKey === "plus" && sub?.isPlanActive) {
    if (!sub.planExpiry || new Date(sub.planExpiry) > new Date()) {
      return 5;
    }
  }
  return 1; // Basic plan default
}

// ── GET /api/business-pages  — list all pages owned by the logged-in user ───

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = (await clientPromise).db(DB_NAME);
    const pages = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .find({ ownerId: new ObjectId(session.user.id), isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    const limit = await getFreelancerPlanLimit(db, session.user.id);

    return NextResponse.json({
      businessPages: pages.map((p) => ({ ...p, _id: p._id.toString() })),
      limit,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/business-pages  — create a new business page ──────────────────

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only freelancers can create business pages
  if ((session.user as any).role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can create business pages." },
      { status: 403 }
    );
  }

  try {
    const { name } = await req.json();
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Business page name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const db = (await clientPromise).db(DB_NAME);

    // ── Plan limit check ────────────────────────────────────────────────────
    const limit = await getFreelancerPlanLimit(db, session.user.id);
    const existing = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .countDocuments({ ownerId: new ObjectId(session.user.id), isActive: true });

    if (existing >= limit) {
      return NextResponse.json(
        {
          error: `You have reached your plan limit of ${limit} business page(s). Upgrade to Plus for more.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // ── Uniqueness check ────────────────────────────────────────────────────
    const slug = toSlug(name.trim());
    const duplicate = await db.collection(COLLECTIONS.BUSINESS_PAGES).findOne({
      $or: [
        { name: { $regex: `^${name.trim()}$`, $options: "i" } },
        { slug },
      ],
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "This business page name is already taken. Please choose a different name." },
        { status: 409 }
      );
    }

    // ── Create ──────────────────────────────────────────────────────────────
    const doc = {
      ownerId: new ObjectId(session.user.id),
      name: name.trim(),
      slug,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.BUSINESS_PAGES).insertOne(doc);

    return NextResponse.json({
      success: true,
      businessPage: { ...doc, _id: result.insertedId.toString() },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
