import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { jsPDF } from "jspdf";

async function getAuthUser(req) {
  try {
    // 1. Try standard next-auth getToken
    const { getToken } = require("next-auth/jwt");
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    if (token) {
      return {
        authenticated: true,
        userId: token.id || token.sub,
        email: token.email,
        name: token.name || ""
      };
    }

    // 2. Try Authorization header
    let authHeader = req.headers.get("authorization");
    let jwtToken = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      jwtToken = authHeader.substring(7);
    }

    // 3. Try query string token
    if (!jwtToken) {
      const { searchParams } = new URL(req.url);
      jwtToken = searchParams.get("token");
    }

    if (jwtToken) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "hirehub_default_secret_key_2024"
      );
      if (decoded) {
        return {
          authenticated: true,
          userId: decoded.userId || decoded.id || decoded.sub,
          email: decoded.email,
          name: decoded.name || ""
        };
      }
    }
  } catch (err) {
    console.error("Auth PDF verification failed:", err);
  }
  return { authenticated: false };
}

export async function GET(req) {
  try {
    const auth = await getAuthUser(req);
    if (!auth.authenticated) {
      return new Response("Unauthorized - Invalid or missing token", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentId");

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userId = new ObjectId(auth.userId);

    // Fetch user for name/email
    const userDoc = await db.collection("users").findOne({ _id: userId }) || {};
    const userName = userDoc.name || auth.name || "Customer";
    const userEmail = userDoc.email || auth.email || "";

    // Find the purchase record
    let invoice = null;
    if (orderId) {
      invoice = await db.collection("plan_purchases").findOne({ orderId }) ||
                await db.collection("bid_purchases").findOne({ orderId }) ||
                await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).findOne({ freelancerId: auth.userId, orderId });
    } else if (paymentId) {
      invoice = await db.collection("plan_purchases").findOne({ paymentId }) ||
                await db.collection("bid_purchases").findOne({ paymentId }) ||
                await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).findOne({ freelancerId: auth.userId, paymentId });
    }

    let label = "Plus Plan";
    let amountUSD = 0;
    let bids = "-";
    let purchasedAt = new Date();
    let planExpiry = null;
    let invoiceId = orderId || paymentId || "N/A";

    if (invoice) {
      if (invoice.packLabel || invoice.bidsAdded) {
        // Bid pack
        label = invoice.packLabel || `${invoice.bidsAdded} Bids`;
        amountUSD = invoice.amountUSD ?? 0;
        bids = invoice.bidsAdded ?? "-";
        purchasedAt = invoice.purchasedAt;
      } else {
        // Plus Plan
        label = invoice.planLabel ? `${invoice.planLabel} Plan` : "Plus Plan";
        if (invoice.billingCycle) {
          label += ` – ${invoice.billingCycle === "yearly" ? "Yearly" : "Monthly"}`;
        }
        amountUSD = invoice.amountUSD ?? 0;
        bids = invoice.bids ?? "-";
        purchasedAt = invoice.purchasedAt || invoice.planStartDate || new Date();
        planExpiry = invoice.planExpiry;
      }
    }

    // Generate PDF using jsPDF
    const doc = new jsPDF();

    // Typography & Design styling
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 107, 53); // #FF6B35 (Orange Brand Color)
    doc.text("FreelanceHub", 20, 25);
    doc.setFontSize(14);
    doc.setTextColor(27, 54, 93); // #1B365D (Navy Brand Color)
    doc.text("Pro", 75, 25);

    // Company Contact Information
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("123 Freelance Ave, Tech City, 10001", 20, 32);
    doc.text("support@freelancehub.com", 20, 37);

    // Invoice Meta (right side)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text("INVOICE", 140, 25);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const dateFormatted = new Date(purchasedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    doc.text(`Date: ${dateFormatted}`, 140, 32);
    doc.text(`Invoice #: ${invoiceId}`, 140, 37);

    // Horizontal Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Bill To details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("BILLED TO", 20, 55);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(userName, 20, 62);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(userEmail, 20, 68);

    // Table Header structure
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 80, 170, 10, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("DESCRIPTION", 25, 86);
    doc.text("BIDS ALLOCATED", 110, 86, { align: "center" });
    doc.text("AMOUNT", 180, 86, { align: "right" });

    // Table Row Content
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(label, 25, 100);
    if (planExpiry) {
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const expiryFormatted = new Date(planExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      doc.text(`Valid until: ${expiryFormatted}`, 25, 105);
    }

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(String(bids), 110, 100, { align: "center" });
    
    const priceStr = amountUSD != null && amountUSD > 0 ? `$${amountUSD.toFixed(2)}` : "Free";
    doc.setFont("Helvetica", "bold");
    doc.text(priceStr, 180, 100, { align: "right" });

    // Table Row Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 112, 190, 112);

    // Total section layout
    doc.setFillColor(248, 250, 252);
    doc.rect(120, 120, 70, 12, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Total", 125, 128);

    doc.setFontSize(13);
    doc.setTextColor(255, 107, 53);
    doc.text(priceStr, 185, 128, { align: "right" });

    // Footer signature
    doc.setDrawColor(241, 245, 249);
    doc.line(20, 160, 190, 160);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Thank you for your business!", 105, 170, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("If you have any questions concerning this invoice, please contact support@freelancehub.com.", 105, 176, { align: "center" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=FreelanceHub_Invoice_${invoiceId}.pdf`,
      },
    });

  } catch (error) {
    console.error("PDF GET error:", error);
    return new Response("Internal Server Error: " + error.message, { status: 500 });
  }
}
