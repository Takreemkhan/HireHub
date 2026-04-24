import { MongoClient } from "mongodb";
import { mongo } from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
    console.log("🟢 MongoDB: new connection (development)");
  } else {
    console.log("♻️  MongoDB: Old connection is being reused (development)");
  }
  clientPromise = global._mongoClientPromise;

} else {

  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const DB_NAME = "freelancehub";
export const COLLECTIONS = {
  JOBS: "jobs",
  USERS: "users",
  PROFILES: "profiles",
  SETTINGS: "settings",
  PROPOSALS: "proposals",
  JOB_SHARES: "job_shares",
  CHATS: "chats",
  MESSAGES: "messages",
  CONVERSATIONS: "conversations",
  OTP_VERIFICATIONS: "otp_verifications",
  ADMIN: "admin",
  FILES: "files",
  TRANSACTIONS: "transactions",
  NOTIFICATIONS: "notifications",
  BIDS: "bids",
  JOB_INVITES: "job_invites",
  FREELANCER_BIDS: "freelancer_bids",
  FREELANCER_PLAN: "freelancer_plans",
  SAVED_JOBS: "saved_jobs",
  CLIENT_SUBSCRIPTIONS: "client_subscriptions",
  CLIENT_PLAN: "client_plans",
  FREELANCER_SUBSCRIPTIONS: "freelancer_subscriptions",
  WALLETS: "wallets",
  WALLET_TRANSACTIONS: "wallet_transactions",
  CONTACTS: "contacts",
  PAYMENTS: "payments",
  DISPUTES: "disputes",
  RESUME_VIDEOS: "resume_videos",
};

export default clientPromise;