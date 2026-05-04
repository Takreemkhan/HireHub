import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true }
}, { timestamps: true });

// Next.js me models re-compile hone se bachane ke liye:
export default mongoose.models.File || mongoose.model('ClientFile', fileSchema);