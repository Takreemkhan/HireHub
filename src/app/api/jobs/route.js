// import { NextResponse } from "next/server";
// import { createJob, getAllJobs } from "@/app/controllers/job.controller";
// import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

// /* CREATE JOB POST (AUTH REQUIRED) */
// export async function POST(req) {
//   try {
//     // Verify token
//     const auth = await verifyAuth(req);
//     if (!auth.authenticated) {
//       return unauthorizedResponse(auth.error);
//     }

//     const body = await req.json();

//     const {
//       category,
//       subCategory,
//       title,
//       description,
//       budget,
//       jobVisibility,
//       freelancerSource,
//       projectDuration
//     } = body;


//     //  token se lenge
//     const clientId = auth.userId;

//     if (
//       !category ||
//       !subCategory ||
//       !title ||
//       !description ||
//       !budget ||
//       !freelancerSource ||
//       !projectDuration
//     ) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const job = await createJob({
//       clientId, //  token- user
//       category,
//       subCategory,
//       title,
//       description,
//       budget,
//       freelancerSource,
//       projectDuration,
//       jobVisibility: jobVisibility || "public",
//        status: "open",            
//       proposalCount: 0,            
//       createdAt: new Date(),     
//       updatedAt: new Date()  
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Job posted successfully",
//         job
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Job POST error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to create job",
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }


// /* GET ALL JOBS */
// export async function GET() {
//   try {
//     const jobs = await getAllJobs();

//     return NextResponse.json(
//       { jobs },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to fetch jobs", error: error.message },
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from "next/server";
import { postJob } from "@/app/controllers/job-post-with-payment.controller";
import { getAllJobs } from "@/app/controllers/job.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* POST - Post a new job (with automatic payment check) */

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    const {
      category,
      subCategory,
      title,
      description,
      budget,
      jobVisibility,
      freelancerSource,
      projectDuration,
      experienceLevel,
      skills,
      currency,
      attachments,
      isFeatured,
      payLater
    } = body;

    // Validation
    if (!category || !subCategory || !title || !description || !budget || !freelancerSource || !projectDuration) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided"
        },
        { status: 400 }
      );
    }

    if (Number(budget) < 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum budget is ₹500"
        },
        { status: 400 }
      );
    }

    //  Post job with payment check (clientId from auth token)
    const result = await postJob(auth.userId, {
      category,
      subCategory,
      title,
      description,
      budget: Number(budget),
      jobVisibility: jobVisibility || "public",
      freelancerSource,
      projectDuration,
      experienceLevel: experienceLevel || null,
      skills: skills || [],
      attachments: attachments || [],
      currency: currency || "INR",
      isFeatured: !!isFeatured,
      payLater: !!payLater
    });

    // If payment required
    if (result.requiresPayment) {
      return NextResponse.json(
        {
          success: false,
          requiresPayment: true,
          message: "Payment required to post this job",
          paymentRequired: result.paymentRequired,
          totalJobsPosted: result.totalJobsPosted,
          freeJobsRemaining: result.freeJobsRemaining
        },
        { status: 402 } // 402 Payment Required
      );
    }

    // Job posted successfully (free)
    return NextResponse.json(
      {
        success: true,
        message: result.message,
        job: result.job,
        requiresPayment: false
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Job POST error:", error);

    if (error.message.includes("required") || error.message.includes("must be")) {
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
        message: "Failed to post job",
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get all jobs
 * Route: /api/jobs
 */
export async function GET() {
  try {
    const jobs = await getAllJobs();

    return NextResponse.json(
      {
        success: true,
        jobs
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch jobs",
        error: error.message
      },
      { status: 500 }
    );
  }
}

