const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("freelancehub");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Find some users
    const users = await db.collection("users").find({}).limit(5).toArray();
    console.log("Users:", users.map(u => ({ email: u.email, name: u.name, emailVerified: u.emailVerified })));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
