import { NextResponse } from "next/server";
import { inviteFreelancers, getJobInvites } from "@/app/controllers/freelancer-invite.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* POST - Invite freelancers to private job */
export async function POST(req, context) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return unauthorizedResponse(auth.error);
        }

        const params = await context.params;
        const { id } = params;
        const jobId = id;

        const body = await req.json();
        const { invites } = body;

        if (!invites || !Array.isArray(invites) || invites.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "invites array is required and must not be empty"
                },
                { status: 400 }
            );
        }

        // Validate each invite has email
        for (const invite of invites) {
            if (!invite.email) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Each invite must have an email"
                    },
                    { status: 400 }
                );
            }
        }

        const result = await inviteFreelancers(jobId, auth.userId, invites);

        return NextResponse.json(
            {
                success: true,
                message: `${result.successful} out of ${result.totalInvites} invites sent successfully`,
                ...result
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Invite Freelancers error:", error);

        if (error.message.includes("not found") || error.message.includes("unauthorized") || error.message.includes("not a private job")) {
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
                message: "Failed to send invites",
                error: error.message
            },
            { status: 500 }
        );
    }
}

/* GET - Get all invites for a job */
export async function GET(req, context) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return unauthorizedResponse(auth.error);
        }

        const params = await context.params;
        const { id } = params;
        const jobId = id;
        console.log("jobId", jobId)
        const result = await getJobInvites(jobId, auth.userId);

        return NextResponse.json(
            {
                success: true,
                ...result
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Get Job Invites error:", error);

        if (error.message.includes("not found") || error.message.includes("unauthorized")) {
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
                message: "Failed to fetch invites",
                error: error.message
            },
            { status: 500 }
        );
    }
}
