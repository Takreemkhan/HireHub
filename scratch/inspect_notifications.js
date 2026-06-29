const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env");
  const envLocalPath = path.join(__dirname, "../.env.local");
  let content = "";
  if (fs.existsSync(envPath)) content += fs.readFileSync(envPath, "utf8") + "\n";
  if (fs.existsSync(envLocalPath)) content += fs.readFileSync(envLocalPath, "utf8") + "\n";
  
  content.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const key = trimmed.substring(0, idx).trim();
    const val = trimmed.substring(idx + 1).replace(/^['"]|['"]$/g, "").trim();
    process.env[key] = val;
  });
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "freelancehub";

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in env.");
    return;
  }

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    const userId = "69de10a6bdbfb40438c7a8a4"; // Vanshika Shrivastava
    const query = { recipientId: new ObjectId(userId), isRead: false };
    
    // Find unread before
    const countBefore = await db.collection("notifications").countDocuments(query);
    console.log("Unread count before update simulation:", countBefore);

    // Simulate update
    const res = await db.collection("notifications").updateMany(
      query,
      { $set: { isRead: true } }
    );
    console.log("updateMany matched count:", res.matchedCount);
    console.log("updateMany modified count:", res.modifiedCount);

    // Find unread after
    const countAfter = await db.collection("notifications").countDocuments(query);
    console.log("Unread count after update simulation:", countAfter);
    
    // Reset back to isRead: false so we don't change state forever
    await db.collection("notifications").updateMany(
      { recipientId: new ObjectId(userId), _id: { $in: (await db.collection("notifications").find({ recipientId: new ObjectId(userId) }).limit(countBefore).toArray()).map(d => d._id) } },
      { $set: { isRead: false } }
    );
    console.log("Reset notifications back to unread.");
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
