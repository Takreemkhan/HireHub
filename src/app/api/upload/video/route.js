// import { NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';
// import { verifyAuth, unauthorizedResponse } from '@/lib/auth.middleware';
// // api/upload/video/route.js
// const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
// const MAX_FILE_SIZE_MB = 50;
// const MAX_FILES = 1;

// export async function POST(req) {
//     try {
//         const auth = await verifyAuth(req);
//         if (!auth.authenticated) return unauthorizedResponse(auth.error);

//         const formData = await req.formData();
//         console.log("form data", formData);
//         const videos = formData.getAll('videos');
//         console.log("All Videos", videos);
//         if (!videos || videos.length === 0) {
//             return NextResponse.json({ success: false, message: 'No videos provided' }, { status: 400 });
//         }

//         if (videos.length > MAX_FILES) {
//             return NextResponse.json(
//                 { success: false, message: `Maximum ${MAX_FILES} videos allowed per proposal` },
//                 { status: 400 }
//             );
//         }

//         const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proposal-videos');
//         await mkdir(uploadDir, { recursive: true });

//         const urls = [];

//         for (const video of videos) {
//             // Type check — strip codec suffix (e.g. "video/webm;codecs=vp9" → "video/webm")
//             const baseMimeType = video.type.split(';')[0].trim();
//             if (!ALLOWED_VIDEO_TYPES.includes(baseMimeType)) {
//                 return NextResponse.json(
//                     { success: false, message: `Invalid file type: ${video.type}. Allowed: mp4, webm, mov, avi` },
//                     { status: 400 }
//                 );
//             }

//             // Size check
//             const sizeMB = video.size / (1024 * 1024);
//             if (sizeMB > MAX_FILE_SIZE_MB) {
//                 return NextResponse.json(
//                     { success: false, message: `File "${video.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit` },
//                     { status: 400 }
//                 );
//             }

//             const bytes = await video.arrayBuffer();
//             const buffer = Buffer.from(bytes);

//             // Safe filename: timestamp + sanitized original name
//             const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, '_');
//             const filename = `${Date.now()}-${auth.userId}-${safeName}`;

//             await writeFile(path.join(uploadDir, filename), buffer);
//             urls.push(`/uploads/proposal-videos/${filename}`);
//         }

//         return NextResponse.json({ success: true, urls }, { status: 200 });
//     } catch (error) {
//         console.error('Video upload error:', error);
//         return NextResponse.json(
//             { success: false, message: 'Video upload failed', error: error.message },
//             { status: 500 }
//         );
//     }
// }

// export const config = {
//     api: { bodyParser: false },
// };


import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth.middleware';
// api/upload/video/route.js
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILES = 3;

export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const formData = await req.formData();

        const videos = formData.getAll('videos');

        if (!videos || videos.length === 0) {
            return NextResponse.json({ success: false, message: 'No videos provided' }, { status: 400 });
        }

        if (videos.length > MAX_FILES) {
            return NextResponse.json(
                { success: false, message: `Maximum ${MAX_FILES} videos allowed per proposal` },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proposal-videos');
        await mkdir(uploadDir, { recursive: true });

        const urls = [];

        for (const video of videos) {
            // Type check — strip codec suffix (e.g. "video/webm;codecs=vp9" → "video/webm")
            const baseMimeType = video.type.split(';')[0].trim();
            if (!ALLOWED_VIDEO_TYPES.includes(baseMimeType)) {
                return NextResponse.json(
                    { success: false, message: `Invalid file type: ${video.type}. Allowed: mp4, webm, mov, avi` },
                    { status: 400 }
                );
            }

            // Size check
            const sizeMB = video.size / (1024 * 1024);
            if (sizeMB > MAX_FILE_SIZE_MB) {
                return NextResponse.json(
                    { success: false, message: `File "${video.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit` },
                    { status: 400 }
                );
            }

            const bytes = await video.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Safe filename: timestamp + sanitized original name
            const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const filename = `${Date.now()}-${auth.userId}-${safeName}`;

            await writeFile(path.join(uploadDir, filename), buffer);
            urls.push(`/uploads/proposal-videos/${filename}`);
        }

        return NextResponse.json({ success: true, urls }, { status: 200 });
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