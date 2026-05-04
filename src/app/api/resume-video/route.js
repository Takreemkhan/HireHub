import { NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth.middleware';
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { randomUUID } from 'crypto';

/* ── GET — fetch all resume videos for the logged-in user (or by ?userId=xxx) ── */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const { searchParams } = new URL(req.url);
        const targetUserId = searchParams.get("userId") ?? auth.userId;

        const doc = await db.collection(COLLECTIONS.RESUME_VIDEOS).findOne({ userId: targetUserId });
        const resumeVideos = doc?.videos;
        const videos = (doc?.videos ?? []).filter(v => v && v.url);

        return NextResponse.json({ success: true, data: videos, resumeVideos }, { status: 200 });
    } catch (error) {
        console.error('Resume video GET error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch resume videos', error: error.message },
            { status: 500 }
        );
    }
}

/* ── POST — save entire videos array (upsert) ── */

export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const body = await req.json();
        let { resumeVideos, append } = body;  // append flag

        if (!resumeVideos || resumeVideos.length === 0) {
            return NextResponse.json({ success: false, message: "No videos provided" }, { status: 400 });
        }

        // Clean and assign IDs
        const cleanVideos = resumeVideos
            .filter(v => v && v.url)
            .map(v => ({ id: v.id || randomUUID(), ...v }));

        if (cleanVideos.length > 3) {
            return NextResponse.json(
                { success: false, message: "Maximum 3 resume videos allowed" },
                { status: 400 }
            );
        }

        // APPEND MODE (for SubmitProposalModal)
        if (append === true) {
            const existingDoc = await db.collection(COLLECTIONS.RESUME_VIDEOS).findOne({ userId: auth.userId });
            const existingVideos = existingDoc?.videos || [];

            // Avoid duplicate URLs (if same video uploaded again)
            const existingUrls = new Set(existingVideos.map(v => v.url));
            const uniqueNewVideos = cleanVideos.filter(v => !existingUrls.has(v.url));

            let mergedVideos = [...existingVideos, ...uniqueNewVideos];
            // Keep only latest 3 (or max 3)
            if (mergedVideos.length > 3) {
                mergedVideos = mergedVideos.slice(-3); // keep most recent 3
            }

            const result = await db.collection(COLLECTIONS.RESUME_VIDEOS).findOneAndUpdate(
                { userId: auth.userId },
                { $set: { videos: mergedVideos, updatedAt: new Date() } },
                { upsert: true, returnDocument: "after" }
            );

            return NextResponse.json({
                success: true,
                message: "Videos appended successfully",
                data: result?.videos ?? mergedVideos,
                resumeVideosID: result?.value?._id
            }, { status: 200 });
        }

        // REPLACE MODE (for ResumeVideoManager)
        const result = await db.collection(COLLECTIONS.RESUME_VIDEOS).findOneAndUpdate(
            { userId: auth.userId },
            { $set: { videos: cleanVideos, updatedAt: new Date() } },
            { upsert: true, returnDocument: "after" }
        );

        return NextResponse.json({
            success: true,
            message: "Videos saved successfully",
            data: result?.videos ?? cleanVideos,
            resumeVideosID: result?.value?._id
        }, { status: 200 });

    } catch (error) {
        console.error('Video POST error:', error);
        return NextResponse.json(
            { success: false, message: 'Video upload failed', error: error.message },
            { status: 500 }
        );
    }
}

/* ── DELETE — remove a single video by its id ── */
export async function DELETE(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { videoId } = await req.json();
        if (!videoId) {
            return NextResponse.json({ success: false, message: "Video id is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTIONS.RESUME_VIDEOS).updateOne(
            { userId: auth.userId },
            { $pull: { videos: { id: videoId } } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: "User document not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Video deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Video DELETE error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete video', error: error.message },
            { status: 500 }
        );
    }
}

/* ── PUT — update title/url of a single video by id ── */
export async function PUT(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { videoId, updatedData } = await req.json();
        if (!videoId || !updatedData) {
            return NextResponse.json(
                { success: false, message: "videoId and updatedData are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Build $set keys for the matching array element
        const setFields = {};
        Object.entries(updatedData).forEach(([key, val]) => {
            setFields[`videos.$.${key}`] = val;
        });

        const result = await db.collection(COLLECTIONS.RESUME_VIDEOS).updateOne(
            { userId: auth.userId, "videos.id": videoId },
            { $set: setFields }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: "User or video not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Video updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Video PUT error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update video', error: error.message },
            { status: 500 }
        );
    }
}