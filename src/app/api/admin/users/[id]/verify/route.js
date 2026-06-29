import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { createNotification } from "@/services/notificationService";

// Helper to send email notification
async function sendVerificationEmail(email, name, action, reason) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const isApproved = action === "approved";
    const subject = isApproved
      ? "Document Verification Approved - FreelanceHub Pro"
      : "Document Verification Rejected - FreelanceHub Pro";

    const statusTitle = isApproved ? "Verification Successful" : "Verification Rejected";
    const statusColor = isApproved ? "#2e7d32" : "#d32f2f";
    const statusBg = isApproved ? "#e8f5e9" : "#ffebee";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
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
              background-color: #0f2744;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .status-badge {
              font-size: 20px;
              font-weight: bold;
              color: ${statusColor};
              background-color: ${statusBg};
              padding: 15px 25px;
              border-radius: 5px;
              display: inline-block;
              margin: 20px 0;
            }
            .reason-box {
              background-color: #f9f9f9;
              border-left: 4px solid #ff6b35;
              padding: 15px;
              text-align: left;
              margin: 20px auto;
              max-width: 80%;
              border-radius: 0 5px 5px 0;
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
              <h1 style="margin:0; font-size:24px; color:#ffffff;">FreelanceHub Pro</h1>
            </div>
            <div class="content">
              <h2 style="color:#0f2744;">Hello ${name},</h2>
              <p>We have reviewed your submitted document for identity verification.</p>
              <div class="status-badge">${statusTitle}</div>
              
              ${!isApproved ? `
                <p>Unfortunately, we could not verify your account due to the following reason:</p>
                <div class="reason-box">
                  <strong>Reason:</strong> ${reason || "No specific reason provided."}
                </div>
                <p>Please log in to your dashboard and re-upload a clear, valid document to complete your verification.</p>
              ` : `
                <p>Congratulations! Your document has been successfully verified. You now have full access to all FreelanceHub Pro features.</p>
              `}
            </div>
            <div class="footer">
              <p>&copy; 2026 FreelanceHub Pro. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

// POST /api/admin/users/[id]/verify
export async function POST(req, { params }) {
  try {
    const { id: userId } = await params;
    const { action, documentId, reason } = await req.json();

    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "documentId required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const now = new Date();

    // Fetch user details first
    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const setFields = {
      verificationStatus: action,
      updatedAt: now,
    };

    if (action === "approved") {
      setFields.approvedAt = now;
      setFields.rejectionReason = null;
      setFields.rejectedAt = null;
    } else {
      setFields.rejectedAt = now;
      setFields.rejectionReason = reason || "Document rejected by admin";
      setFields.approvedAt = null;
    }

    await db.collection(COLLECTIONS.FILES).updateOne(
      { _id: new ObjectId(documentId), userId: new ObjectId(userId) },
      {
        $set: setFields,
        $push: {
          verificationHistory: {
            status: action,
            comment: reason || (action === "approved" ? "Approved by admin" : "Rejected by admin"),
            updatedAt: now,
          },
        },
      }
    );

    await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          documentVerified: action === "approved",
          documentVerifiedAt: action === "approved" ? now : null,
          updatedAt: now,
        },
      }
    );

    // 1. Send email notification
    await sendVerificationEmail(user.email, user.name || "User", action, setFields.rejectionReason);

    // 2. Create in-app notification
    try {
      await createNotification({
        recipientId: userId,
        type: "document_verification",
        title: action === "approved" ? "Document Approved" : "Document Rejected",
        body: action === "approved"
          ? "Your identity verification document has been approved."
          : `Your identity verification document was rejected. Reason: ${setFields.rejectionReason}`,
        link: user.role === "freelancer" ? "/freelancer-dashboard" : "/client-dashboard",
      });
    } catch (notifErr) {
      console.error("Failed to create in-app notification:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: `Document ${action} successfully`,
      data: { userId, documentId, action, reason: setFields.rejectionReason, updatedAt: now },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Verification failed", error: error.message },
      { status: 500 }
    );
  }
}