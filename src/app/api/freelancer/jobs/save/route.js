import { NextResponse } from "next/server";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ POST (Save job)
export async function POST(req) {
    const { jobId, freelancerId } = await req.json();

    const db = (await clientPromise).db();
    const savedJobs = db.collection(COLLECTIONS.SAVED_JOBS);

    const jobObjectId = new ObjectId(jobId);
    const freelancerObjectId = new ObjectId(freelancerId);

    const savedJob = await savedJobs.findOne({
        jobId: jobObjectId,
        freelancerId: freelancerObjectId,
    });

    if (savedJob) {
        return NextResponse.json({ message: "Job already saved" });
    }

    await savedJobs.insertOne({
        jobId: jobObjectId,
        freelancerId: freelancerObjectId,
        createdAt: new Date(),
    });

    return NextResponse.json({
        message: "Job saved successfully",
    });
}


// ✅ GET (Check saved or not)


export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const freelancerId = searchParams.get("freelancerId");

        if (!ObjectId.isValid(freelancerId)) {
            return NextResponse.json(
                { message: "Invalid freelancerId" },
                { status: 400 }
            );
        }

        const db = (await clientPromise).db();
        const savedJobs = db.collection(COLLECTIONS.SAVED_JOBS);

        const freelancerObjectId = new ObjectId(freelancerId);

        // ✅ Get all saved jobs of this freelancer
        const savedJobList = await savedJobs
            .find({ freelancerId: freelancerObjectId })
            .toArray();

        return NextResponse.json({
            success: true,
            count: savedJobList.length,
            data: savedJobList,
        });

    } catch (error) {
        console.log("error", error);
        return NextResponse.json(
            { error: "Failed", message: error.message },
            { status: 500 }
        );
    }
}

// ✅ DELETE (Unsave job)

export async function DELETE(req) {
    try {
        const { jobId, freelancerId } = await req.json();


        const cleanJobId = jobId?.trim();
        const cleanFreelancerId = freelancerId?.trim();

        // ✅ Validate IDs  
        if (
            !ObjectId.isValid(cleanJobId) ||
            !ObjectId.isValid(cleanFreelancerId)
        ) {
            return NextResponse.json(
                { message: "Invalid IDs" },
                { status: 400 }
            );
        }

        const db = (await clientPromise).db();
        const savedJobs = db.collection(COLLECTIONS.SAVED_JOBS);

        const result = await savedJobs.deleteOne({
            jobId: new ObjectId(cleanJobId),
            freelancerId: new ObjectId(cleanFreelancerId),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Saved job not found",
            });
        }

        return NextResponse.json({
            success: true,
            message: "Job removed from saved",
        });

    } catch (error) {
        console.log("error", error);
        return NextResponse.json(
            { error: "Failed", message: error.message },
            { status: 500 }
        );
    }
}