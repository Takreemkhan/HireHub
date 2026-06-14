const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const uri = process.env.MONGODB_URI;
const DB_NAME = "freelancehub";

if (!uri) {
  console.error("❌ MONGODB_URI not found");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("🟢 Connected to MongoDB");
    const db = client.db(DB_NAME);

    console.log("⏳ Creating indexes...");

    // Users indexes
    await db.collection("users").createIndex({ role: 1 });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    // Profiles indexes
    await db.collection("profiles").createIndex({ userId: 1 });
    await db.collection("profiles").createIndex({ role: 1 });
    await db.collection("profiles").createIndex({ skills: 1 });
    await db.collection("profiles").createIndex({ hourlyRate: 1 });
    await db.collection("profiles").createIndex({ rating: -1 });

    // Jobs indexes
    await db.collection("jobs").createIndex({ clientId: 1 });
    await db.collection("jobs").createIndex({ freelancerId: 1 });
    await db.collection("jobs").createIndex({ status: 1 });
    await db.collection("jobs").createIndex({ createdAt: -1 });
    await db.collection("jobs").createIndex({ isDeleted: 1 });
    await db.collection("jobs").createIndex({ isDraft: 1 });

    // Proposals indexes
    await db.collection("proposals").createIndex({ jobId: 1 });
    await db.collection("proposals").createIndex({ freelancerId: 1 });

    console.log("✅ All indexes created successfully!");
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
  } finally {
    await client.close();
  }
}

createIndexes();
