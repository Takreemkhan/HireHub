/**
 * Seed script: Replaces ALL old freelancer_plans with new Basic & Plus plans.
 * Run once via: node src/scripts/seed-subscription-plans.js
 */
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "freelancehub";
const COLLECTION = "freelancer_plans";

const NEW_PLANS = [
  {
    planKey: "basic",
    planType: "basic",
    label: "Basic",
    description: "Free plan with essential bid features",
    isFree: true,
    price: 0,
    currency: "USD",
    bonusBids: 20,      // one-time on signup
    monthlyBids: 10,    // refreshed every month
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

async function seedPlans() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // Remove all old plans
    const deleteResult = await col.deleteMany({});
    console.log(`✅ Removed ${deleteResult.deletedCount} old plan(s)`);

    // Insert new Basic & Plus plans
    const insertResult = await col.insertMany(NEW_PLANS);
    console.log(`✅ Inserted ${insertResult.insertedCount} new plan(s): Basic & Plus`);

    const plans = await col.find({}, { projection: { _id: 0 } }).toArray();
    console.log("\nPlans now in DB:");
    plans.forEach(p => {
      console.log(`  - ${p.label} (${p.planKey}): ${p.isFree ? "Free" : `$${p.pricing.monthly.amountUSD}/mo | $${p.pricing.yearly.amountUSD}/yr`}`);
    });
  } finally {
    await client.close();
  }
}

seedPlans().catch(console.error);
