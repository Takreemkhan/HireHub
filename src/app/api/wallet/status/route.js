import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/wallet/status
 * Returns current wallet balance for the logged-in user.
 * If no wallet exists yet, returns balance: 0.
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);
        // Find wallet by ObjectId OR String userId to prevent mismatches
        const wallet = await db.collection("wallets").findOne({
            $or: [{ userId: userId }, { userId: auth.userId }]
        });

        if (!wallet) {
            return NextResponse.json({
                success: true,
                wallet: { balance: 0, userId: auth.userId },
            });
        }

        return NextResponse.json({
            success: true,
            wallet: {
                balance: wallet.balance ?? 0,
                updatedAt: wallet.updatedAt,
                createdAt: wallet.createdAt,
            },
        });
    } catch (error) {
        console.error("Wallet status error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch wallet status" },
            { status: 500 }
        );
    }
}