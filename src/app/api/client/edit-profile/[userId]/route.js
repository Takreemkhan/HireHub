import { NextResponse } from "next/server";
import { 
  getProfileByUserId,
  updateHourlyRate,
  updateProfessionalHeadline,
  updateTopSkills,
  updateSummary,
  updateAvailability,
  deleteProfile
} from "@/app/controllers/client.controller";
import { 
  verifyAuth, 
  unauthorizedResponse, 
  forbiddenResponse,
  checkOwnership 
} from "@/lib/auth.middleware";

/* GET - Fetch specific user's profile */

export async function GET(req, { params }) {
  try {
  
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { userId } = params;

    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return NextResponse.json(
        { 
          success: false,
          message: "Profile not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        profile 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch profile", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/* PATCH - Update specific fields of user's profile */
export async function PATCH(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { userId } = params;

    // Check if user is updating their own profile
    if (!checkOwnership(auth.userId, userId)) {
      return forbiddenResponse("You can only update your own profile");
    }

    const body = await req.json();
    const { action, ...data } = body;

    let result;

    // Handle specific actions
    switch (action) {
      case "updateRate":
        if (!data.hourlyRate) {
          return NextResponse.json(
            { success: false, message: "Hourly rate is required" },
            { status: 400 }
          );
        }
        result = await updateHourlyRate(userId, data.hourlyRate, data.currency);
        break;

      case "updateHeadline":
        if (!data.professionalHeadline) {
          return NextResponse.json(
            { success: false, message: "Professional headline is required" },
            { status: 400 }
          );
        }
        result = await updateProfessionalHeadline(userId, data.professionalHeadline);
        break;

      case "updateSkills":
        if (!data.topSkills || !Array.isArray(data.topSkills)) {
          return NextResponse.json(
            { success: false, message: "Skills array is required" },
            { status: 400 }
          );
        }
        result = await updateTopSkills(userId, data.topSkills);
        break;

      case "updateSummary":
        if (!data.summary) {
          return NextResponse.json(
            { success: false, message: "Summary is required" },
            { status: 400 }
          );
        }
        result = await updateSummary(userId, data.summary);
        break;

      case "updateAvailability":
        if (!data.availability) {
          return NextResponse.json(
            { success: false, message: "Availability status is required" },
            { status: 400 }
          );
        }
        result = await updateAvailability(userId, data.availability);
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action specified" },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Profile not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Profile updated successfully", 
        profile: result 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to update profile", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/* DELETE - Delete user's profile */
export async function DELETE(req, { params }) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { userId } = params;

    // Check if user is deleting their own profile
    if (!checkOwnership(auth.userId, userId)) {
      return forbiddenResponse("You can only delete your own profile");
    }

    const deleted = await deleteProfile(userId);

    if (!deleted) {
      return NextResponse.json(
        { 
          success: false,
          message: "Profile not found or already deleted" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Profile deleted successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile DELETE error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to delete profile", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
