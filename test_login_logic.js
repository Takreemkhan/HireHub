const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("freelancehub");
    
    // Let's test with the verified user: carinsightproject@gmail.com
    const email = "carinsightproject@gmail.com";
    const password = "admin"; // Wait, we don't know the password. Let's see if we can find any user or just test the JWT signing part.
    
    const user = await db.collection("users").findOne({ email });
    console.log("Found user:", !!user);
    if (!user) return;
    
    const { password: _, ...userWithoutPassword } = user;
    console.log("userWithoutPassword keys:", Object.keys(userWithoutPassword));
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "freelancer" },
      "hirehub_default_secret_key_2024",
      { expiresIn: "30d" }
    );
    console.log("Generated Token:", token);
    
    console.log("Result payload structure:", {
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: token
    });
  } catch (e) {
    console.error("Logic error:", e);
  } finally {
    await client.close();
  }
}

main();
