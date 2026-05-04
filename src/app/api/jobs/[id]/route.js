// import { NextResponse } from "next/server";
// import { getJobById, updateJobById, deleteJobById } from "@/app/controllers/job.controller";
// import { 
//   verifyAuth, 
//   unauthorizedResponse, 
//   forbiddenResponse,
//   checkOwnership 
// } from "@/lib/auth.middleware";

// /* FETCH SINGLE JOB */
// export async function GET(req, { params }) {
//   try {
//     const job = await getJobById(params.id);

//     if (!job) {
//       return NextResponse.json({ message: "Job not found" }, { status: 404 });
//     }

//     return NextResponse.json({ job }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch job", error: error.message }, { status: 500 });
//   }
// }

// /* UPDATE JOB */
// export async function PATCH(req, { params }) {
//   try {
//     //  Verify token
//     const auth = await verifyAuth(req);
//     if (!auth.authenticated) {
//       return unauthorizedResponse(auth.error);
//     }

//     //  Get job
//     const job = await getJobById(params.id);
//     if (!job) {
//       return NextResponse.json(
//         { message: "Job not found" },
//         { status: 404 }
//       );
//     }

//     // Ownership check
//     if (!checkOwnership(auth.userId, job.clientId)) {
//       return forbiddenResponse("You are not allowed to update this job");
//     }

//     const body = await req.json();
//     const updatedJob = await updateJobById(params.id, body);

//     return NextResponse.json(
//       { message: "Job updated successfully", job: updatedJob },
//       { status: 200 }
//     );

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to update job", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* DELETE JOB */
// export async function DELETE(req, { params }) {
//   try {
//     //  Verify token
//     const auth = await verifyAuth(req);
//     if (!auth.authenticated) {
//       return unauthorizedResponse(auth.error);
//     }

//     //Get job
//     const job = await getJobById(params.id);
//     if (!job) {
//       return NextResponse.json(
//         { message: "Job not found" },
//         { status: 404 }
//       );
//     }

//     //  Ownership check
//     if (!checkOwnership(auth.userId, job.clientId)) {
//       return forbiddenResponse("You are not allowed to delete this job");
//     }

//     await deleteJobById(params.id);

//     return NextResponse.json(
//       { message: "Job deleted successfully" },
//       { status: 200 }
//     );

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to delete job", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { getJobById, updateJobById, deleteJobById } from "@/app/controllers/job.controller";

/**
 * GET - Get job by ID
 * Route: /api/jobs/[id]
 */
export async function GET(req, context) {
  try {
    //  CRITICAL: Await params in Next.js 15
    const params = await context.params;
    const job = await getJobById(params.id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Job GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch job", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update job by ID
 * Route: /api/jobs/[id]
 */
export async function PUT(req, context) {
  try {
    //  CRITICAL: Await params in Next.js 15
    const params = await context.params;
    const body = await req.json();

    const updatedJob = await updateJobById(params.id, body);

    if (!updatedJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Job updated successfully", job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Job PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update job", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete job by ID
 * Route: /api/jobs/[id]
 */
export async function DELETE(req, context) {
  try {
    //  CRITICAL: Await params in Next.js 15
    const params = await context.params;
    const deleted = await deleteJobById(params.id);

    if (!deleted) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Job DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete job", error: error.message },
      { status: 500 }
    );
  }
}