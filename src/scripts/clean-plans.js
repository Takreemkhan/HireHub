import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("No MONGODB_URI found.");
    process.exit(1);
}

const NEW_PLANS = [
    {
        planKey: "basic",
        planType: "basic",
        label: "Basic",
        description: "Free plan with essential bid features",
        isFree: true,
        price: 0,
        currency: "USD",
        bonusBids: 20,
        monthlyBids: 10,
        businessPages: 1,
        features: [
            "20 bonus bids (one-time on signup)",
            "10 bids refreshed every month",
            "1 business page",
        ],
        accentColor: "#1B365D",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        planKey: "plus",
        planType: "plus",
        label: "Plus",
        description: "Everything you need to grow your freelance business",
        isFree: false,
        pricing: {
            monthly: { amountUSD: 25, bids: 30, billingCycle: "monthly" },
            yearly:  { amountUSD: 250, bids: 360, billingCycle: "yearly" },
        },
        businessPages: 5,
        features: [
            "Everything in Basic",
            "3 resume views with description",
            "Hide project budget publicly",
            "Email alerts for recommended jobs",
            "Send proposals to featured jobs",
            "5 business pages",
            "Featured listing placement",
            "AI-powered support",
        ],
        accentColor: "#FF6B35",
        popular: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

async function cleanPlans() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("freelancehub");
        const col = db.collection("freelancer_plans");

        // Delete everything
        const delRes = await col.deleteMany({});
        console.log(`Deleted ${delRes.deletedCount} old plans.`);

        // Insert fresh
        const insRes = await col.insertMany(NEW_PLANS);
        console.log(`Inserted ${insRes.insertedCount} new plans.`);
        
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

cleanPlans();
