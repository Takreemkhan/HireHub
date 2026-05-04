'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DocumentIcon, XMarkIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type Side = 'front' | 'back';
type DocType = 'pan' | 'voter_id' | 'driving_license' | 'passport' | 'bank_statement' | 'other' | '';

interface FileStatus {
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  documentType: string;
  uploadDate: string;
  rejectionReason?: string;
}

const DOC_OPTIONS: { value: DocType; label: string }[] = [
  { value: 'pan',             label: 'PAN Card' },
  { value: 'voter_id',        label: 'Voter ID' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'passport',        label: 'Passport' },
  { value: 'bank_statement',  label: 'Bank Statement' },
  { value: 'other',           label: 'Other' },
];

const Filesection = () => {
  const { data: session, status: sessionStatus } = useSession();
  // NextAuth session mein user.id directly available hai
  const userId = session?.user?.id;

  const [selectedDocument, setSelectedDocument] = useState<DocType>('');
  const [frontFile, setFrontFile]     = useState<File | null>(null);
  const [backFile, setBackFile]       = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview]   = useState<string | null>(null);
  const [frontError, setFrontError]   = useState('');
  const [backError, setBackError]     = useState('');
  const [isDragging, setIsDragging]   = useState({ front: false, back: false });

  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileStatus, setFileStatus]   = useState<FileStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef  = useRef<HTMLInputElement>(null);

  // ── Existing document status fetch ───────────────────────────────
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (!userId) { setLoadingStatus(false); return; }

    const fetchStatus = async () => {
      setLoadingStatus(true);
      try {
        const res  = await fetch(`/api/client/${userId}/files`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Latest document (already sorted by uploadedAt desc from API)
          const latest = json.data[0];

          // documentType display label
          const docLabel = DOC_OPTIONS.find(d => d.value === latest.documentType)?.label
            || latest.documentType
            || '';

          setFileStatus({
            status:          latest.verificationStatus || 'pending',
            documentType:    latest.documentType || '',
            uploadDate:      latest.uploadedAt
              ? new Date(latest.uploadedAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })
              : '',
            rejectionReason: latest.rejectionReason || undefined,
          });
        } else {
          setFileStatus(null);
        }
      } catch (err) {
        console.error('Failed to fetch file status:', err);
        setFileStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [userId, sessionStatus]);

  // ── File validation & preview ─────────────────────────────────────
  const handleFileUpload = (file: File, side: Side) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      side === 'front' ? setFrontError('Invalid file type. JPG, PNG, PDF allowed.') : setBackError('Invalid file type.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      side === 'front' ? setFrontError('Max size is 10MB') : setBackError('Max size is 10MB');
      return;
    }
    if (side === 'front') {
      setFrontError(''); setFrontFile(file);
      if (file.type.startsWith('image/')) {
        const r = new FileReader();
        r.onloadend = () => setFrontPreview(r.result as string);
        r.readAsDataURL(file);
      } else setFrontPreview(null);
    } else {
      setBackError(''); setBackFile(file);
      if (file.type.startsWith('image/')) {
        const r = new FileReader();
        r.onloadend = () => setBackPreview(r.result as string);
        r.readAsDataURL(file);
      } else setBackPreview(null);
    }
  };

  const removeFile = (side: Side) => {
    if (side === 'front') { setFrontFile(null); setFrontPreview(null); setFrontError(''); }
    else                  { setBackFile(null);  setBackPreview(null);  setBackError(''); }
  };

  const needsBothSides = selectedDocument !== 'pan' && selectedDocument !== 'bank_statement';
  const isValid = () => !!selectedDocument && !!frontFile && (!needsBothSides || !!backFile);

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!isValid() || !userId || !selectedDocument) return;
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('files', frontFile!);
      if (backFile) formData.append('files', backFile);
      // ✅ documentType explicitly append karo
      formData.append('documentType', selectedDocument);

      const res  = await fetch(`/api/client/${userId}/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Upload failed');
      }

      // Success — status update karo locally
      setFileStatus({
        status:       'pending',
        documentType: selectedDocument,
        uploadDate:   new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
      });

      // Form reset
      setSelectedDocument('');
      setFrontFile(null); setBackFile(null);
      setFrontPreview(null); setBackPreview(null);

    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Upload Card component ─────────────────────────────────────────
  const UploadCard = ({ side, label }: { side: Side; label: string }) => {
    const file     = side === 'front' ? frontFile    : backFile;
    const preview  = side === 'front' ? frontPreview : backPreview;
    const error    = side === 'front' ? frontError   : backError;
    const dragging = isDragging[side];
    const inputRef = side === 'front' ? frontInputRef : backInputRef;

    return (
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold text-[#4A5568] uppercase tracking-wide mb-2">
          {label} <span className="text-red-500">*</span>
        </p>

        {!file ? (
          <div
            onDragEnter={e => { e.preventDefault(); setIsDragging(p => ({ ...p, [side]: true })); }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(p => ({ ...p, [side]: false })); }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(p => ({ ...p, [side]: false }));
              const f = e.dataTransfer.files[0];
              if (f) handleFileUpload(f, side);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-1.5 h-52 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
              ${dragging ? 'border-[#FF6B35] bg-orange-50 scale-[1.02]' : 'border-[#D1D5DB] hover:border-[#FF6B35] hover:bg-gray-50'}`}
          >
            <svg className={`w-7 h-7 ${dragging ? 'text-[#FF6B35]' : 'text-[#9CA3AF]'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xs text-[#6B7280] text-center px-2">
              <span className="font-semibold text-[#FF6B35]">Click</span> or drag &amp; drop
            </p>
            <p className="text-[10px] text-[#9CA3AF]">JPG, PNG, PDF · Max 10MB</p>
            <input
              ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0], side); }}
            />
          </div>
        ) : (
          <div className="h-52 rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] flex flex-col items-center justify-center gap-2 p-3 relative">
            {preview
              ? <img src={preview} alt="preview" className="h-14 w-full object-contain rounded-lg" />
              : <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <DocumentIcon className="w-6 h-6 text-gray-500" />
                </div>
            }
            <div className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <p className="text-[11px] text-[#4A5568] truncate max-w-[110px]">{file.name}</p>
            </div>
            <button
              onClick={() => removeFile(side)}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        )}
        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      </div>
    );
  };

  // ── Status Banner ─────────────────────────────────────────────────
  const StatusBanner = () => {
    if (!fileStatus) return null;
    const { status, documentType, uploadDate, rejectionReason } = fileStatus;
    const docLabel = DOC_OPTIONS.find(d => d.value === documentType)?.label || documentType || 'Document';

    if (status === 'approved') return (
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-green-700">Document Verified!</p>
          <p className="text-xs text-green-600 mt-0.5">{docLabel} · Uploaded on {uploadDate}</p>
        </div>
      </div>
    );

    if (status === 'rejected') return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700">Document Rejected</p>
          <p className="text-xs text-red-500 mt-0.5">{docLabel} · Uploaded on {uploadDate}</p>
          {rejectionReason && (
            <div className="mt-2 px-3 py-2 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection Reason:</p>
              <p className="text-xs text-red-600">{rejectionReason}</p>
            </div>
          )}
          <p className="text-xs text-red-500 mt-2 font-medium">Please re-upload a valid document below.</p>
        </div>
      </div>
    );

    return (
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-2xl">⏳</span>
        <div>
          <p className="text-sm font-semibold text-amber-700">Under Review</p>
          <p className="text-xs text-amber-600 mt-0.5">{docLabel} · Uploaded on {uploadDate}</p>
          <p className="text-xs text-amber-500 mt-1">Admin review mein hai. Thoda wait karein.</p>
        </div>
      </div>
    );
  };

  const canReupload = !fileStatus || fileStatus.status === 'rejected';

  // ── Render ────────────────────────────────────────────────────────
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 font-display mb-4">Document verification</h2>
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 space-y-5">

        {/* Session loading */}
        {sessionStatus === 'loading' || loadingStatus ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            Loading document status...
          </div>
        ) : !userId ? (
          <p className="text-sm text-red-500">Session expired. Please login again.</p>
        ) : (
          <>
            {/* Status Banner */}
            <StatusBanner />

            {/* Upload form — only when no doc or rejected */}
            {canReupload && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#4A5568] mb-2">
                    Select document type
                  </label>
                  <select
                    value={selectedDocument}
                    onChange={e => {
                      setSelectedDocument(e.target.value as DocType);
                      setFrontFile(null); setBackFile(null);
                      setFrontPreview(null); setBackPreview(null);
                      setFrontError(''); setBackError('');
                    }}
                    className="w-full max-w-md border border-[#E2E8F0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    <option value="">Select a document type</option>
                    {DOC_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {selectedDocument && (
                  <>
                    <div className={`flex gap-4 ${!needsBothSides ? 'max-w-[50%]' : ''}`}>
                      <UploadCard side="front" label={!needsBothSides ? 'Upload Document' : 'Front Side'} />
                      {needsBothSides && <UploadCard side="back" label="Back Side" />}
                    </div>

                    {uploadError && (
                      <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        ⚠️ {uploadError}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={!isValid() || uploading}
                        className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                          isValid() && !uploading
                            ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2b] shadow-sm'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {uploading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                        {uploading ? 'Uploading...' : 'Submit for Verification'}
                      </button>
                      {!isValid() && (
                        <p className="text-xs text-[#9CA3AF]">Please upload all required files</p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, PDF · Max size: 10MB per file
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Filesection;