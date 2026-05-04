import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth.middleware';
import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
const MAX_FILE_SIZE_MB = 50;

export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        // ── Check active resume video subscription ─────────────────────────
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const sub = await db
            .collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        const now = new Date();
        const isPlanActive = sub
            ? sub.isPlanActive && sub.planExpiry && new Date(sub.planExpiry) > now
            : false;

        if (!isPlanActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Upgrade to a Resume Video plan (Basic / Pro / Elite) to upload videos.',
                    code: 'NO_VIDEO_PLAN',
                },
                { status: 403 }
            );
        }

        const maxVideos = sub.maxVideos ?? 1;

        // ── Parse form data ────────────────────────────────────────────────
        const formData = await req.formData();
        const videos = formData.getAll('videos');

        if (!videos || videos.length === 0) {
            return NextResponse.json({ success: false, message: 'No videos provided' }, { status: 400 });
        }

        if (videos.length > maxVideos) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Your ${sub.planLabel} plan allows up to ${maxVideos} video${maxVideos !== 1 ? 's' : ''}. You tried to upload ${videos.length}.`,
                    code: 'PLAN_LIMIT_EXCEEDED',
                    maxVideos,
                },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proposal-videos');
        await mkdir(uploadDir, { recursive: true });

        const urls = [];

        for (const video of videos) {
            const baseMimeType = video.type.split(';')[0].trim();
            if (!ALLOWED_VIDEO_TYPES.includes(baseMimeType)) {
                return NextResponse.json(
                    { success: false, message: `Invalid file type: ${video.type}. Allowed: mp4, webm, mov, avi` },
                    { status: 400 }
                );
            }

            const sizeMB = video.size / (1024 * 1024);
            if (sizeMB > MAX_FILE_SIZE_MB) {
                return NextResponse.json(
                    { success: false, message: `File "${video.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit` },
                    { status: 400 }
                );
            }

            const bytes = await video.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const filename = `${Date.now()}-${auth.userId}-${safeName}`;

            await writeFile(path.join(uploadDir, filename), buffer);
            urls.push(`/uploads/proposal-videos/${filename}`);
        }

        return NextResponse.json({ success: true, urls, maxVideos }, { status: 200 });
    } catch (error) {
        console.error('Video upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Video upload failed', error: error.message },
            { status: 500 }
        );
    }
}

export const config = {
    api: { bodyParser: false },
};