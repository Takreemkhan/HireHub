// // /api/user/name/[userId]
// // Lightweight endpoint — returns only the user's display name.
// // No auth required (name is not sensitive; used for chat UI labels).

// import { NextResponse } from "next/server";
// import clientPromise, { DB_NAME } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(
//   _req: Request,
//   { params }: { params: { userId: string } }
// ) {
//   const { userId } = params;

//   if (!userId || !ObjectId.isValid(userId)) {
//     return NextResponse.json({ name: "User" });
//   }

//   try {
//     const db = (await clientPromise).db(DB_NAME);
//     const user = await db
//       .collection("users")
//       .findOne(
//         { _id: new ObjectId(userId) },
//         { projection: { name: 1, firstName: 1, lastName: 1, email: 1 } }
//       );

//     if (!user) return NextResponse.json({ name: "User" });

//     // Try every possible field combination
//     const name =
//       (user.firstName && user.lastName
//         ? `${user.firstName} ${user.lastName}`.trim()
//         : null) ||
//       user.name ||
//       user.firstName ||
//       user.lastName ||
//       user.email?.split("@")[0] ||
//       "User";

//     return NextResponse.json({ name });
//   } catch (error) {
//     console.error("Error fetching user name:", error);
//     return NextResponse.json({ name: "User" });
//   }
// }




import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ name: "User", profileImage: null });
  }

  try {
    const db = (await clientPromise).db(DB_NAME);
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { name: 1, firstName: 1, lastName: 1, email: 1, profileImage: 1 } }
      );

    if (!user) return NextResponse.json({ name: "User", profileImage: null });

    let profileImage = user.profileImage || null;

    // If profile image not in users collection, check profiles collection
    if (!profileImage) {
      try {
        const profile = await db.collection("profiles").findOne(
          { userId: new ObjectId(userId) },
          { projection: { profileImage: 1 } }
        );
        if (profile?.profileImage) {
          profileImage = profile.profileImage;
        }
      } catch (e) {
        console.error("Error fetching from profiles collection:", e);
      }
    }

    const name =
      (user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : null) ||
      user.name ||
      user.firstName ||
      user.lastName ||
      user.email?.split("@")[0] ||
      "User";

    return NextResponse.json({ name, profileImage });
  } catch (error) {
    console.error("Error fetching user name:", error);
    return NextResponse.json({ name: "User", profileImage: null });
  }
}
