import { NextResponse } from "next/server";
import { 
  getUserSettings,
  createDefaultSettings
} from "@/app/controllers/settings.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Fetch user settings  */
export async function GET(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || auth.userId;

    // Get settings
    let settings = await getUserSettings(userId);

    // If settings don't exist, create default ones
    if (!settings) {
      settings = await createDefaultSettings(userId, auth.email);
    }

    return NextResponse.json(
      { 
        success: true,
        settings 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch settings", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/* POST - Create default settings (usually called automatically) */
export async function POST(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const { email } = body;

    // Create default settings
    const settings = await createDefaultSettings(
      auth.userId, 
      email || auth.email
    );

    return NextResponse.json(
      { 
        success: true,
        message: "Settings created successfully", 
        settings 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to create settings", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
