import React from "react";
import { FiEdit3, FiEye, FiFileText, FiAlertTriangle } from "react-icons/fi";

interface PartySubmission {
  description: string;
  additionalNotes: string;
  mediaFiles: any[];
  submittedAt: string;
}

interface ResolutionSummary {
  resolutionTitle: string;
  resolutionCategory: string;
  finalDecision: string;
  adminNotes: string;
  internalNotes: string;
  resolvedBy: string;
}

interface Dispute {
  id: string;
  chatId: string | null;
  jobId: string | null;
  jobTitle: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  freelancerId: string | null;
  freelancerName: string;
  freelancerEmail: string;
  raisedBy: string;
  disputeType: string;
  title: string;
  description: string;
  resolution: string;
  partialAmount: number | null;
  additionalNotes: string;
  mediaFiles: any[];
  escrowAmount: number | null;
  status: string;
  disputeWorkflowStatus: string;
  freelancerResponse: PartySubmission | null;
  clientStatement: PartySubmission | null;
  resolutionSummary: ResolutionSummary | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DisputeDetailProps {
  selectedDispute: any;
  handleResolveDispute: (dis: any) => void;
  setShowResolutionWorkspace: (show: boolean) => void;
  setResolutionSuccess: (success: boolean) => void;
  setPreviewFile: (file: { url: string; name: string } | null) => void;
}

export default function DisputeDetail({
  selectedDispute,
  handleResolveDispute,
  setShowResolutionWorkspace,
  setResolutionSuccess,
  setPreviewFile,
}: DisputeDetailProps) {
  return (
    <div className="p-6 space-y-5 bg-white min-h-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between border-b pb-4 border-gray-100 gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {selectedDispute.disputeType?.replace(/_/g, " ")}
            </span>
            {(() => {
              const wf = selectedDispute.disputeWorkflowStatus || "raised";
              const bs: Record<string, string> = {
                raised: "bg-red-50 text-red-700 border-red-200",
                awaiting_response: "bg-amber-50 text-amber-700 border-amber-200",
                evidence_collection: "bg-blue-50 text-blue-700 border-blue-200",
                admin_reviewing: "bg-violet-50 text-violet-700 border-violet-200",
                resolution_drafted: "bg-indigo-50 text-indigo-700 border-indigo-200",
                resolved: "bg-green-50 text-green-700 border-green-200",
              };
              const ls: Record<string, string> = {
                raised: "Dispute Raised",
                awaiting_response: "Awaiting Response",
                evidence_collection: "Evidence Collection",
                admin_reviewing: "Admin Reviewing",
                resolution_drafted: "Resolution Drafted",
                resolved: "Resolved",
              };
              return (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${bs[wf] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {ls[wf] || wf}
                </span>
              );
            })()}
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-2">{selectedDispute.title}</h3>
        </div>
        {selectedDispute.status !== "resolved" ? (
          <button
            onClick={() => handleResolveDispute(selectedDispute)}
            className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-900/10 transition-colors flex items-center gap-2 shrink-0"
          >
            <FiEdit3 size={12} /> Resolve Dispute
          </button>
        ) : (
          <button
            onClick={() => {
              setShowResolutionWorkspace(true);
              setResolutionSuccess(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 shrink-0"
          >
            <FiEye size={12} /> View Resolution
          </button>
        )}
      </div>

      {/* Contract Info */}
      <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold bg-[#FF6B35] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Contract Info
          </span>
          <h4 className="text-sm font-bold text-[#0f2744] mt-1">{selectedDispute.jobTitle}</h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-gray-400 font-semibold">Job ID:</span>
            <code className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[11px] font-mono text-[#0f2744] shadow-sm select-all">
              {selectedDispute.jobId || "N/A"}
            </code>
          </div>
          {selectedDispute.escrowAmount && (
            <p className="text-xs text-gray-500">
              Escrow: <span className="font-bold text-green-700">₹{Number(selectedDispute.escrowAmount).toLocaleString("en-IN")}</span>
            </p>
          )}
        </div>
        <div className="p-2.5 bg-white border border-orange-200 rounded-xl text-orange-500 shadow-sm shrink-0">
          <FiFileText size={18} />
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`border rounded-xl p-3 bg-white shadow-sm ${selectedDispute.raisedBy === "client" ? "border-sky-300 bg-sky-50/30" : "border-gray-100"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-sky-500 bg-sky-50 px-2 py-0.5 rounded">Client</span>
            {selectedDispute.raisedBy === "client" && (
              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">RAISED</span>
            )}
          </div>
          <h5 className="font-semibold text-sm text-gray-900">{selectedDispute.clientName}</h5>
          <p className="text-xs text-gray-400">{selectedDispute.clientEmail}</p>
        </div>
        <div className={`border rounded-xl p-3 bg-white shadow-sm ${selectedDispute.raisedBy === "freelancer" ? "border-violet-300 bg-violet-50/30" : "border-gray-100"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-violet-500 bg-violet-50 px-2 py-0.5 rounded">Freelancer</span>
            {selectedDispute.raisedBy === "freelancer" && (
              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">RAISED</span>
            )}
          </div>
          <h5 className="font-semibold text-sm text-gray-900">{selectedDispute.freelancerName}</h5>
          <p className="text-xs text-gray-400">{selectedDispute.freelancerEmail}</p>
        </div>
      </div>

      {/* Both-Party Submissions Side-by-Side */}
      <div>
        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Party Submissions</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Side */}
          <div className="bg-sky-50/40 border border-sky-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700">🧑‍💼 Client Submission</span>
              {selectedDispute.raisedBy === "client" ? (
                <span className="text-[9px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold border border-sky-200">Original</span>
              ) : selectedDispute.clientStatement ? (
                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">Submitted</span>
              ) : (
                <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">Awaiting</span>
              )}
            </div>
            {selectedDispute.raisedBy === "client" ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-sky-100">{selectedDispute.description}</p>
                {selectedDispute.resolution && (
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Requested: </span>
                    {selectedDispute.resolution.replace(/_/g, " ")}
                    {selectedDispute.partialAmount && ` (₹${selectedDispute.partialAmount.toLocaleString("en-IN")})`}
                  </p>
                )}
                {selectedDispute.additionalNotes && <p className="text-xs text-gray-500 italic">{selectedDispute.additionalNotes}</p>}
                {selectedDispute.mediaFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDispute.mediaFiles.map((f: any, i: number) => {
                      const u = typeof f === "string" ? f : f.fileUrl || "";
                      const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                      return (
                        <button
                          key={i}
                          onClick={() => setPreviewFile({ url: u, name: n })}
                          className="flex items-center gap-1 border border-sky-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-sky-700 hover:bg-sky-50"
                        >
                          <FiEye size={10} />
                          {n.slice(0, 18)}
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedDispute.creatorAdditionalEvidence && (
                  <div className="mt-3 pt-3 border-t border-sky-100/60 space-y-1.5">
                    <p className="text-[9px] font-extrabold text-sky-600 uppercase tracking-widest">📎 Additional Evidence / Comments</p>
                    {selectedDispute.creatorAdditionalEvidence.description && (
                      <p className="text-xs text-gray-700 bg-white/60 rounded-xl p-3 border border-sky-50">{selectedDispute.creatorAdditionalEvidence.description}</p>
                    )}
                    {selectedDispute.creatorAdditionalEvidence.mediaFiles?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDispute.creatorAdditionalEvidence.mediaFiles.map((f: any, i: number) => {
                          const u = typeof f === "string" ? f : f.fileUrl || "";
                          const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                          return (
                            <button
                              key={i}
                              onClick={() => setPreviewFile({ url: u, name: n })}
                              className="flex items-center gap-1 border border-sky-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-sky-700 hover:bg-sky-50"
                            >
                              <FiEye size={10} />
                              {n.slice(0, 18)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedDispute.clientStatement ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-sky-100">{selectedDispute.clientStatement.description}</p>
                {selectedDispute.clientStatement.additionalNotes && <p className="text-xs text-gray-500 italic">{selectedDispute.clientStatement.additionalNotes}</p>}
                {selectedDispute.clientStatement.mediaFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDispute.clientStatement.mediaFiles.map((f: any, i: number) => {
                      const u = typeof f === "string" ? f : f.fileUrl || "";
                      const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                      return (
                        <button
                          key={i}
                          onClick={() => setPreviewFile({ url: u, name: n })}
                          className="flex items-center gap-1 border border-sky-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-sky-700 hover:bg-sky-50"
                        >
                          <FiEye size={10} />
                          {n.slice(0, 18)}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[10px] text-gray-400">
                  Submitted: {new Date(selectedDispute.clientStatement.submittedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-4 bg-white/40 rounded-xl border border-dashed border-sky-200">
                Awaiting client response
              </div>
            )}
          </div>

          {/* Freelancer Side */}
          <div className="bg-violet-50/40 border border-violet-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-700">👨‍💻 Freelancer Submission</span>
              {selectedDispute.raisedBy === "freelancer" ? (
                <span className="text-[9px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-bold border border-violet-200">Original</span>
              ) : selectedDispute.freelancerResponse ? (
                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">Submitted</span>
              ) : (
                <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">Awaiting</span>
              )}
            </div>
            {selectedDispute.raisedBy === "freelancer" ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-violet-100">{selectedDispute.description}</p>
                {selectedDispute.resolution && (
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Requested: </span>
                    {selectedDispute.resolution.replace(/_/g, " ")}
                    {selectedDispute.partialAmount && ` (₹${selectedDispute.partialAmount.toLocaleString("en-IN")})`}
                  </p>
                )}
                {selectedDispute.additionalNotes && <p className="text-xs text-gray-500 italic">{selectedDispute.additionalNotes}</p>}
                {selectedDispute.mediaFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDispute.mediaFiles.map((f: any, i: number) => {
                      const u = typeof f === "string" ? f : f.fileUrl || "";
                      const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                      return (
                        <button
                          key={i}
                          onClick={() => setPreviewFile({ url: u, name: n })}
                          className="flex items-center gap-1 border border-violet-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                        >
                          <FiEye size={10} />
                          {n.slice(0, 18)}
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedDispute.creatorAdditionalEvidence && (
                  <div className="mt-3 pt-3 border-t border-violet-100/60 space-y-1.5">
                    <p className="text-[9px] font-extrabold text-violet-600 uppercase tracking-widest">📎 Additional Evidence / Comments</p>
                    {selectedDispute.creatorAdditionalEvidence.description && (
                      <p className="text-xs text-gray-700 bg-white/60 rounded-xl p-3 border border-violet-50">{selectedDispute.creatorAdditionalEvidence.description}</p>
                    )}
                    {selectedDispute.creatorAdditionalEvidence.mediaFiles?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDispute.creatorAdditionalEvidence.mediaFiles.map((f: any, i: number) => {
                          const u = typeof f === "string" ? f : f.fileUrl || "";
                          const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                          return (
                            <button
                              key={i}
                              onClick={() => setPreviewFile({ url: u, name: n })}
                              className="flex items-center gap-1 border border-violet-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                            >
                              <FiEye size={10} />
                              {n.slice(0, 18)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedDispute.freelancerResponse ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-violet-100">{selectedDispute.freelancerResponse.description}</p>
                {selectedDispute.freelancerResponse.additionalNotes && <p className="text-xs text-gray-500 italic">{selectedDispute.freelancerResponse.additionalNotes}</p>}
                {selectedDispute.freelancerResponse.mediaFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDispute.freelancerResponse.mediaFiles.map((f: any, i: number) => {
                      const u = typeof f === "string" ? f : f.fileUrl || "";
                      const n = typeof f === "string" ? `File ${i + 1}` : f.fileName || `File ${i + 1}`;
                      return (
                        <button
                          key={i}
                          onClick={() => setPreviewFile({ url: u, name: n })}
                          className="flex items-center gap-1 border border-violet-200 bg-white rounded-lg px-2 py-1 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                        >
                          <FiEye size={10} />
                          {n.slice(0, 18)}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[10px] text-gray-400">
                  Submitted: {new Date(selectedDispute.freelancerResponse.submittedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-4 bg-white/40 rounded-xl border border-dashed border-violet-200">
                Awaiting freelancer response
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Report (if resolved) */}
      {selectedDispute.status === "resolved" && selectedDispute.resolutionSummary && (
        <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5 space-y-3">
          <h5 className="text-xs font-bold text-green-700 uppercase tracking-widest">✅ Resolution Report</h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Resolution</p>
              <p className="font-semibold text-gray-800 mt-0.5">{selectedDispute.resolutionSummary.resolutionTitle}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-semibold text-gray-800 mt-0.5 capitalize">{selectedDispute.resolutionSummary.resolutionCategory?.replace(/_/g, " ")}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Final Decision</p>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{selectedDispute.resolutionSummary.finalDecision}</p>
          </div>
          <div className="text-xs text-gray-400 pt-2 border-t border-green-200">
            Resolved by: {selectedDispute.resolutionSummary.resolvedBy} on{" "}
            {selectedDispute.resolvedAt ? new Date(selectedDispute.resolvedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
          </div>
        </div>
      )}
    </div>
  );
}
