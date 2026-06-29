import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, role, subject, message } = await req.json();

    if (!name || !email || !role || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "codinginfotech@gmail.com",
      subject: `Inquiry from ${name}: ${subject}`,
      text: `New contact message from FreelanceHub Pro\n\nName: ${name}\nEmail: ${email}\nRole: ${role}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">New Message from FreelanceHub Pro Contact Form</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Full Name:</td>
              <td style="padding: 6px 0; color: #334155;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0; color: #334155;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">User Role:</td>
              <td style="padding: 6px 0; color: #334155;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Topic/Subject:</td>
              <td style="padding: 6px 0; color: #334155;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Message Content:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316; color: #0f172a; line-height: 1.5; white-space: pre-wrap;">${message}</div>
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 10px; text-align: center;">This message was generated automatically from the contact page form.</p>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
