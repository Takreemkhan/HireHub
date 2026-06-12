import { getFreelancerActivity } from "@/app/controllers/client.controller";
import { NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/redis";

// hours function 
function formatTime(minutes) {
    if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    }

    const hours = minutes / 60;

    if (minutes % 60 === 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    if (minutes % 60 === 30) {
        return `${Math.floor(hours)}.5 hours`;

    }

    return `${hours.toFixed(1)} hours`;
}

export async function GET(req) {
    try {
        const cachedActivity = await getOrSetCache(
            "api:client:freelancer-activity",
            async () => {
                const freelancerActivity = await getFreelancerActivity();

                const totalCompletedJobs = freelancerActivity.reduce(
                    (sum, freelancer) => sum + (freelancer.completedJobs || 0),
                    0
                );

                const averageRating = freelancerActivity.length
                    ? freelancerActivity.reduce(
                        (sum, freelancer) => sum + (freelancer.rating || 0),
                        0
                    ) / freelancerActivity.length
                    : 0;

                const avgResponseTimeRaw = freelancerActivity.length
                    ? freelancerActivity.reduce(
                        (sum, freelancer) => sum + (freelancer.hourlyRate || 0),
                        0
                    ) / freelancerActivity.length
                    : 0;

                //  formatted value
                const avgResponseTime = formatTime(avgResponseTimeRaw);

                return {
                    activeFreelancers: freelancerActivity.length,
                    totalCompletedJobs,
                    averageRating: Number(averageRating.toFixed(1)),
                    avgResponseTime
                };
            },
            600 // Cache for 10 minutes
        );

        return NextResponse.json(
            {
                success: true,
                message: "Freelancer activity fetched successfully",
                freelancerActivity: cachedActivity
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch freelancer activity",
                error: error.message
            },
            { status: 500 }
        );
    }
}