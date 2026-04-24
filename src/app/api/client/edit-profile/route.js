import { NextResponse } from "next/server";
import { 
  upsertProfile, 
  getProfileByUserId,
  getAllProfiles 
} from "@/app/controllers/client.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";


/* POST - Create or update profile  */


export async function POST(req) {
  try {
    
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    const {
      hourlyRate,
      currency,
      professionalHeadline,
      topSkills,
      summary,
      availability
    } = body;

    // Validation
    if (!professionalHeadline || professionalHeadline.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false,
          message: "Professional headline must be at least 10 characters" 
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(topSkills) || topSkills.length < 3) {
      return NextResponse.json(
        { 
          success: false,
          message: "At least 3 skills are required" 
        },
        { status: 400 }
      );
    }

    if (topSkills.length > 20) {
      return NextResponse.json(
        { 
          success: false,
          message: "Maximum 20 skills allowed" 
        },
        { status: 400 }
      );
    }

    if (!summary || summary.trim().length < 50) {
      return NextResponse.json(
        { 
          success: false,
          message: "Summary must be at least 50 characters" 
        },
        { status: 400 }
      );
    }

    if (!hourlyRate || hourlyRate < 1) {
      return NextResponse.json(
        { 
          success: false,
          message: "Valid hourly rate is required" 
        },
        { status: 400 }
      );
    }

    // Upsert profile
    const profile = await upsertProfile(auth.userId, {
      hourlyRate: Number(hourlyRate),
      currency: currency || "USD",
      professionalHeadline: professionalHeadline.trim(),
      topSkills: topSkills.map(skill => skill.trim()),
      summary: summary.trim(),
      availability: availability || "available"
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Profile updated successfully", 
        profile 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile POST error:", error);
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



export async function GET(req) {
  try {
   
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // If userId is provided, get specific profile
    if (userId) {
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
    }

    // Otherwise, get all profiles with filters
    const filters = {
      skills: searchParams.get("skills")?.split(","),
      minRate: searchParams.get("minRate"),
      maxRate: searchParams.get("maxRate"),
      availability: searchParams.get("availability")
    };

    const result = await getAllProfiles(page, limit, filters);

    return NextResponse.json(
      { 
        success: true,
        ...result 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch profile(s)", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}






/*PATCH - Partial update of profile

 */

export async function PATCH(req) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();
    
    // Remove undefined/null values
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v != null)
    );

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: "No valid fields to update" 
        },
        { status: 400 }
      );
    }

    // Validate specific fields if present
    if (updateData.topSkills) {
      if (!Array.isArray(updateData.topSkills) || 
          updateData.topSkills.length < 3 || 
          updateData.topSkills.length > 20) {
        return NextResponse.json(
          { 
            success: false,
            message: "Skills must be an array with 3-20 items" 
          },
          { status: 400 }
        );
      }
    }

    if (updateData.hourlyRate && updateData.hourlyRate < 1) {
      return NextResponse.json(
        { 
          success: false,
          message: "Hourly rate must be at least 1" 
        },
        { status: 400 }
      );
    }

    const profile = await upsertProfile(auth.userId, updateData);

    return NextResponse.json(
      { 
        success: true,
        message: "Profile updated successfully", 
        profile 
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
