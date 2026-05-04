import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

/*  EMAIL VERIFICATION WITH OTP   */


// Generate 6-digit OTP 
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* Email transporter configuration */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,     
      pass: process.env.EMAIL_PASSWORD  
    }
  });
};

/* SEND OTP EMAIL */
export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - FreelanceHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #ff6b35;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp {
            font-size: 36px;
            font-weight: bold;
            color: #ff6b35;
            letter-spacing: 5px;
            margin: 30px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FreelanceHub</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

/* SAVE OTP TO DATABASE */
export const saveOTP = async (email, otp) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.collection(COLLECTIONS.OTP_VERIFICATIONS).updateOne(
    { email },
    {
      $set: {
        otp,
        expiresAt,
        verified: false,
        createdAt: new Date()
      }
    },
    { upsert: true }
  );
};

/* VERIFY OTP */
export const verifyOTP = async (email, otp) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const otpRecord = await db.collection(COLLECTIONS.OTP_VERIFICATIONS).findOne({
    email,
    otp
  });

  if (!otpRecord) {
    return { success: false, message: "Invalid OTP" };
  }

  // Check if expired
  if (new Date() > new Date(otpRecord.expiresAt)) {
    return { success: false, message: "OTP has expired" };
  }

  // Mark as verified
  await db.collection(COLLECTIONS.OTP_VERIFICATIONS).updateOne(
    { email },
    { $set: { verified: true, verifiedAt: new Date() } }
  );

  // Mark user as verified
  await db.collection(COLLECTIONS.USERS).updateOne(
    { email },
    { $set: { emailVerified: true, emailVerifiedAt: new Date() } }
  );

  return { success: true, message: "Email verified successfully" };
};

/* RESEND OTP */
export const resendOTP = async (email) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Check if user exists
  const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
  
  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  // Check rate limiting (max 3 OTPs in 30 minutes)
  const recentOTPs = await db.collection(COLLECTIONS.OTP_VERIFICATIONS).countDocuments({
    email,
    createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
  });

  if (recentOTPs >= 3) {
    throw new Error("Too many OTP requests. Please try again after 30 minutes.");
  }

  // Generate and send new OTP
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);

  return { success: true, message: "OTP sent successfully" };
};

/* SIGN UP WITH OTP */
export const signUpWithOTP = async (userData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const { email, password, firstName, lastName, role } = userData;

  // Check if user already exists
  const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email });
  
  if (existingUser) {
    if (existingUser.emailVerified) {
      throw new Error("Email already registered and verified");
    } else {
      throw new Error("Email already registered. Please verify your email.");
    }
  }

  // Hash password
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user (unverified)
  const newUser = {
    email,
    password: hashedPassword,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    role,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser);

  // Generate and send OTP
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp);

  return {
    userId: result.insertedId,
    email,
    message: "User created. Please verify your email with the OTP sent."
  };
};

/* CHECK IF EMAIL VERIFIED (for login) */
export const checkEmailVerified = async (email) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
  
  if (!user) {
    return { verified: false, exists: false };
  }

  return { 
    verified: user.emailVerified || false, 
    exists: true,
    userId: user._id 
  };
};




