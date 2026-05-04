"use client";

import { useState, useEffect, useCallback } from "react";

interface FileDoc {
  _id: string;
  fileName: string;
  fileFormat: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  documentType?: string;
  verificationStatus: string;
  rejectionReason?: string;
}

interface FileUploadProps {
  userId: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

const DOC_OPTIONS = [
  { value: "pan",             label: "PAN Card" },
  { value: "voter_id",        label: "Voter ID" },
  { value: "driving_license", label: "Driving License" },
  { value: "passport",        label: "Passport" },
  { value: "bank_statement",  label: "Bank Statement" },
  { value: "other",           label: "Other" },
];

const DOC_LABEL_MAP: Record<string, string> = {
  pan:             "PAN Card",
  voter_id:        "Voter ID",
  driving_license: "Driving License",
  passport:        "Passport",
  bank_statement:  "Bank Statement",
  other:           "Other",
};

export default function FileUpload({
  userId,
  maxFiles = 10,
  acceptedFileTypes = [".jpg", ".jpeg", ".png", ".pdf"],
}: FileUploadProps) {
  const [files, setFiles]             = useState<FileDoc[]>([]);
  const [uploading, setUploading]     = useState(false);
  const [message, setMessage]         = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [documentType, setDocumentType] = useState("");   // ✅ NEW

  // ── Fetch files ────────────────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    try {
      const res  = await fetch(`/api/client/${userId}/files`);
      const data = await res.json();
      if (data.success) setFiles(data.data);
      else setMessage({ type: "error", text: "Failed to fetch files" });
    } catch {
      setMessage({ type: "error", text: "Error loading files" });
    }
  }, [userId]);

  useEffect(() => { if (userId) fetchFiles(); }, [userId, fetchFiles]);

  // ── Upload ─────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // ✅ documentType check
    if (!documentType) {
      setMessage({ type: "error", text: "❌ Pehle document type select karo" });
      return;
    }
    if (selectedFiles.length > maxFiles) {
      setMessage({ type: "error", text: `Maximum ${maxFiles} files allowed` });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("files", file));
    formData.append("documentType", documentType); // ✅ documentType append

    try {
      const res  = await fetch(`/api/client/${userId}/upload`, { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: `✅ ${data.message}` });
        setDocumentType(""); // reset
        await fetchFiles();
        e.target.value = "";
      } else {
        setMessage({ type: "error", text: `❌ ${data.message}` });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`"${fileName}" delete karein?`)) return;
    setDeletingId(fileId);
    try {
      const res  = await fetch(`/api/client/${userId}/files?fileId=${fileId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "✅ File deleted" });
        setFiles(prev => prev.filter(f => f._id !== fileId));
      } else {
        setMessage({ type: "error", text: `❌ ${data.message}` });
      }
    } catch {
      setMessage({ type: "error", text: "❌ Failed to delete" });
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))   return "📄";
    if (fileType.includes("image")) return "🖼️";
    return "📁";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));

  const getStatusBadge = (status: string, rejectionReason?: string) => {
    switch (status) {
      case "pending":      return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending",      icon: "⏳", message: "Document review mein jayega 24-48 hours mein." };
      case "under_review": return { bg: "bg-blue-100",   text: "text-blue-800",   label: "Under Review", icon: "🔍", message: "Aapka document review ho raha hai." };
      case "approved":     return { bg: "bg-green-100",  text: "text-green-800",  label: "Approved",     icon: "✅", message: "Document verified ho gaya!" };
      case "rejected":     return { bg: "bg-red-100",    text: "text-red-800",    label: "Rejected",     icon: "❌", message: rejectionReason || "Document reject hua." };
      default:             return { bg: "bg-gray-100",   text: "text-gray-800",   label: "Unknown",      icon: "❓", message: "" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📁 Document Manager</h2>

        {/* ── Upload Section ── */}
        <div className="mb-8 space-y-4">

          {/* Step 1 — Document type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step 1 — Document type select karo <span className="text-red-500">*</span>
            </label>
            <select
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select document type --</option>
              {DOC_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Step 2 — File input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step 2 — File upload karo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept={acceptedFileTypes.join(",")}
              onChange={handleUpload}
              disabled={uploading || !documentType}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {!documentType && (
              <p className="text-xs text-orange-500 mt-1">⚠️ Pehle document type select karo</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Accepted: JPEG, PNG, PDF · Max 10MB</p>
          </div>
        </div>

        {/* Status Messages */}
        {uploading && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading...
          </div>
        )}
        {message && (
          <div className={`mb-4 p-4 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {/* Files List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">My Files ({files.length})</h3>

          {files.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => {
                const badge = getStatusBadge(file.verificationStatus, file.rejectionReason);
                return (
                  <div key={file._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getFileIcon(file.fileType)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 truncate">{file.fileName}</p>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                            {file.fileFormat}
                          </span>
                          {/* ✅ Document Type badge */}
                          {file.documentType && (
                            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                              {DOC_LABEL_MAP[file.documentType] || file.documentType}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                            {badge.icon} {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>·</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <a href={file.url} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="View">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <a href={file.url} download={file.fileName}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Download">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <button onClick={() => handleDelete(file._id, file.fileName)}
                          disabled={deletingId === file._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className={`mt-3 p-3 rounded-lg text-sm ${badge.bg} ${badge.text}`}>
                      <div className="flex items-start gap-2">
                        <span>{badge.icon}</span>
                        <div>
                          <p className="font-medium">{badge.label}</p>
                          <p className="opacity-90">{badge.message}</p>
                          {file.verificationStatus === "rejected" && file.rejectionReason && (
                            <p className="mt-1 font-semibold">Reason: {file.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}