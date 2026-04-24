import { NextResponse } from "next/server";
import {
  getDraftById,
  updateDraft,
  deleteDraft,
  publishDraft
} from "@/app/controllers/draft-job.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get single draft by ID */
export async function GET(req, { params }) {
  try {
   
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { draftId } = params;

    const draft = await getDraftById(draftId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        draft
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft GET error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch draft",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* PUT - Update draft */
export async function PUT(req, { params }) {
  try {
   
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { draftId } = params;
    const body = await req.json();

    const {
      category,
      subCategory,
      title,
      description,
      budget,
      jobVisibility,
      freelancerSource,
      projectDuration
    } = body;

    // For draft update, at least title should be present
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required"
        },
        { status: 400 }
        
      );
    }

    const updatedDraft = await updateDraft(draftId, auth.userId, {
      category: category || null,
      subCategory: subCategory || null,
      title: title.trim(),
      description: description || null,
      budget: budget ? Number(budget) : null,
      freelancerSource: freelancerSource || null,
      projectDuration: projectDuration || null,
      jobVisibility: jobVisibility || "public"
    });

    return NextResponse.json(
      {
        success: true,
        message: "Draft updated successfully",
        draft: updatedDraft
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft PUT error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update draft",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* DELETE  */
export async function DELETE(req, { params }) {
  try {
   
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { draftId } = params;

    const deleted = await deleteDraft(draftId, auth.userId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete draft"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Draft deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft DELETE error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete draft",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/* PATCH */
export async function PATCH(req, { params }) {
  try {
   
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const { draftId } = params;
    const body = await req.json();

    if (body.action !== "publish") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Use 'publish' to publish draft"
        },
        { status: 400 }
      );
    }

    const publishedJob = await publishDraft(draftId, auth.userId);

    return NextResponse.json(
      {
        success: true,
        message: "Draft published successfully",
        job: publishedJob
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Draft PATCH error:", error);

    if (error.message.includes("not found") || error.message.includes("permission")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    if (error.message.includes("Missing required fields")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish draft",
        error: error.message
      },
      { status: 500 }
    );
  }
}




