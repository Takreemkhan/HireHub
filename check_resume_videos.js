const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("freelancehub");
    console.log("Fetching resume_videos collection records...");
    const docs = await db.collection("resume_videos").find({}).toArray();
    console.log("Documents in resume_videos:", JSON.stringify(docs, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
