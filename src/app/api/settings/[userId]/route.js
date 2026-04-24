import { NextResponse } from "next/server";
import {
  updatePersonalUrl,
  updateEmail,
  changePassword,
  updateSecurityQuestion,
  updateAccountStatus,
  toggleTwoFactor,
  updateProposalCredits,
  adjustProposalCredits,
  verifyEmail,
  deleteSettings
} from "@/app/controllers/settings.controller";
import { 
  verifyAuth, 
  unauthorizedResponse, 
  forbiddenResponse,
  checkOwnership 
} from "@/lib/auth.middleware";

/* PATCH - Update specific settings */
export async function PATCH(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { userId } = params;

    // Check if user is updating their own settings
    if (!checkOwnership(auth.userId, userId)) {
      return forbiddenResponse("You can only update your own settings");
    }

    const body = await req.json();
    const { action, ...data } = body;

    let result;

    // Handle specific actions
    switch (action) {
      case "updateUrl":
        if (!data.personalUrl) {
          return NextResponse.json(
            { success: false, message: "Personal URL is required" },
            { status: 400 }
          );
        }
        result = await updatePersonalUrl(userId, data.personalUrl);
        break;

      case "updateEmail":
        if (!data.email) {
          return NextResponse.json(
            { success: false, message: "Email is required" },
            { status: 400 }
          );
        }
        result = await updateEmail(userId, data.email);
        break;

      case "changePassword":
        if (!data.currentPassword || !data.newPassword) {
          return NextResponse.json(
            { success: false, message: "Current and new password are required" },
            { status: 400 }
          );
        }
        if (data.newPassword !== data.confirmPassword) {
          return NextResponse.json(
            { success: false, message: "New passwords do not match" },
            { status: 400 }
          );
        }
        result = await changePassword(userId, data.currentPassword, data.newPassword);
        break;

      case "updateSecurityQuestion":
        if (!data.newQuestion || !data.newAnswer) {
          return NextResponse.json(
            { success: false, message: "Security question and answer are required" },
            { status: 400 }
          );
        }
        result = await updateSecurityQuestion(
          userId, 
          data.oldAnswer, 
          data.newQuestion, 
          data.newAnswer
        );
        break;

      case "updateAccountStatus":
        if (!data.status) {
          return NextResponse.json(
            { success: false, message: "Account status is required" },
            { status: 400 }
          );
        }
        result = await updateAccountStatus(userId, data.status);
        break;

      case "toggleTwoFactor":
        if (typeof data.enabled !== "boolean") {
          return NextResponse.json(
            { success: false, message: "Enabled flag is required" },
            { status: 400 }
          );
        }
        result = await toggleTwoFactor(userId, data.enabled);
        break;

      case "updateCredits":
        if (typeof data.credits !== "number") {
          return NextResponse.json(
            { success: false, message: "Credits amount is required" },
            { status: 400 }
          );
        }
        result = await updateProposalCredits(userId, data.credits);
        break;

      case "adjustCredits":
        if (typeof data.amount !== "number") {
          return NextResponse.json(
            { success: false, message: "Adjustment amount is required" },
            { status: 400 }
          );
        }
        result = await adjustProposalCredits(userId, data.amount);
        break;

      case "verifyEmail":
        result = await verifyEmail(userId);
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action specified" },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Settings not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Settings updated successfully", 
        settings: result 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "Failed to update settings", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/* DELETE - Delete user settings (when account is deleted)  */
export async function DELETE(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { userId } = params;

    // Check if user is deleting their own settings
    if (!checkOwnership(auth.userId, userId)) {
      return forbiddenResponse("You can only delete your own settings");
    }

    const deleted = await deleteSettings(userId);

    if (!deleted) {
      return NextResponse.json(
        { 
          success: false,
          message: "Settings not found or already deleted" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Settings deleted successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Settings DELETE error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to delete settings", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}