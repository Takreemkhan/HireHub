import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // 1. Seed Bids Packs
        const bidPacks = [
            {
                packKey: 'pack10',
                bids: 10,
                amountINR: 199,
                label: '10 Bids',
                tagline: 'Perfect for occasional applicants',
                popular: false,
                color: '#2E5984',
                gradient: 'from-blue-600 to-blue-700',
                createdAt: new Date(),
            },
            {
                packKey: 'pack20',
                bids: 20,
                amountINR: 349,
                label: '20 Bids',
                tagline: 'Great value for active freelancers',
                popular: true,
                color: '#FF6B35',
                gradient: 'from-orange-500 to-red-500',
                createdAt: new Date(),
            },
            {
                packKey: 'pack50',
                bids: 50,
                amountINR: 799,
                label: '50 Bids',
                tagline: 'Best value — stock up and save',
                popular: false,
                color: '#1B365D',
                gradient: 'from-indigo-700 to-blue-900',
                createdAt: new Date(),
            },
        ];

        // 2. Seed Resume Video Plans
        const videoPlans = [
            {
                planKey: "basic",
                label: "Basic",
                amountINR: 499,
                durationDays: 30,
                maxVideos: 1,
                description: "Upload 1 resume video on proposals",
                features: [
                    "Upload 1 resume video per proposal",
                    "MP4, WebM, MOV supported",
                    "50MB video size limit",
                    "Stand out from free users",
                ],
                accentColor: "#2E5984",
                createdAt: new Date(),
            },
            {
                planKey: "pro",
                label: "Pro",
                amountINR: 999,
                durationDays: 30,
                maxVideos: 3,
                description: "Upload up to 3 resume videos on proposals",
                features: [
                    "Upload up to 3 resume videos",
                    "Record directly from camera",
                    "Select from profile saved videos",
                    "MP4, WebM, MOV, AVI supported",
                    "50MB per video",
                ],
                accentColor: "#FF6B35",
                popular: true,
                createdAt: new Date(),
            },
            {
                planKey: "elite",
                label: "Elite",
                amountINR: 1999,
                durationDays: 30,
                maxVideos: 5,
                description: "Upload up to 5 resume videos + featured profile badge",
                features: [
                    "Upload up to 5 resume videos",
                    "Premium badge on profile",
                    "Priority support",
                    "Featured in search",
                ],
                accentColor: "#1B365D",
                createdAt: new Date(),
            },
        ];

        // Clear and Insert
        await db.collection(COLLECTIONS.BIDS).deleteMany({});
        await db.collection(COLLECTIONS.BIDS).insertMany(bidPacks);

        await db.collection(COLLECTIONS.FREELANCER_PLAN).deleteMany({});
        await db.collection(COLLECTIONS.FREELANCER_PLAN).insertMany(videoPlans);

        return NextResponse.json({
            success: true,
            message: "Catalogs seeded successfully",
            bidsCount: bidPacks.length,
            plansCount: videoPlans.length
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
