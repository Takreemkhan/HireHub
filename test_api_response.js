const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("freelancehub");
    
    const email = "test_dev@example.com";
    const password = "password123";
    
    // Clean up
    await db.collection("users").deleteOne({ email });
    await db.collection("otp_verifications").deleteOne({ email });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert verified user
    const newUser = {
      email,
      password: hashedPassword,
      name: "Dev Test User",
      firstName: "Dev",
      lastName: "Test",
      role: "freelancer",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.collection("users").insertOne(newUser);
    
    // Insert verified OTP record
    await db.collection("otp_verifications").insertOne({
      email,
      otp: "123456",
      verified: true,
      expiresAt: new Date(Date.now() + 600000),
      createdAt: new Date()
    });
    
    console.log("Created test user:", email);
    
    // Now call the endpoint
    const response = await fetch("http://localhost:4028/api/auth/custom-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log("Response Status:", response.status);
    const text = await response.text();
    console.log("Response Text:", text);
    
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.close();
  }
}

main();
