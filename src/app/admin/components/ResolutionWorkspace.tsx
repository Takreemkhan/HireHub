import React from "react";
import { FiArrowLeft, FiCheckCircle, FiEdit3, FiSave, FiSend, FiAlertTriangle } from "react-icons/fi";

interface ResolutionDraft {
  resolutionTitle: string;
  resolutionCategory: string;
  finalDecision: string;
  adminNotes: string;
  internalNotes: string;
  refundClientAmount: string;
  releaseFreelancerAmount: string;
  platformAdjustment: string;
  reopenChat: boolean;
  sendSystemMessage: boolean;
  notifyClient: boolean;
  notifyFreelancer: boolean;
}

interface ResolutionWorkspaceProps {
  selectedDispute: any;
  resolutionForm: ResolutionDraft;
  setResolutionForm: React.Dispatch<React.SetStateAction<ResolutionDraft>>;
  resolutionSaving: boolean;
  resolutionPublishing: boolean;
  resolutionSuccess: boolean;
  setResolutionSuccess: (success: boolean) => void;
  setShowResolutionWorkspace: (show: boolean) => void;
  handleSaveDraft: () => void;
  handlePublishResolution: () => void;
}

export default function ResolutionWorkspace({
  selectedDispute,
  resolutionForm,
  setResolutionForm,
  resolutionSaving,
  resolutionPublishing,
  resolutionSuccess,
  setResolutionSuccess,
  setShowResolutionWorkspace,
  handleSaveDraft,
  handlePublishResolution,
}: ResolutionWorkspaceProps) {
  const total =
    (Number(resolutionForm.refundClientAmount) || 0) +
    (Number(resolutionForm.releaseFreelancerAmount) || 0) +
    (Number(resolutionForm.platformAdjustment) || 0);
  const escrow = Number(selectedDispute.escrowAmount) || 0;

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResolutionWorkspace(false)}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-[#0f2744] transition-all"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h3 className="font-bold text-[#0f2744] text-base">Resolution Workspace</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Case: <span className="font-mono font-semibold">DISPUTE-{selectedDispute.id.slice(-6).toUpperCase()}</span>
            </p>
          </div>
        </div>
        {resolutionSuccess ? (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <FiCheckCircle size={13} /> Resolution Published
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <FiEdit3 size={12} /> Drafting Resolution
          </span>
        )}
      </div>

      {resolutionSuccess ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheckCircle size={32} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Resolution Published!</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">The dispute has been resolved and both parties have been notified.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 w-full max-w-md text-left space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Resolution Title</span>
              <span className="font-semibold text-gray-900">{resolutionForm.resolutionTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <span className="font-semibold capitalize">{resolutionForm.resolutionCategory.replace(/_/g, " ")}</span>
            </div>
            <div className="border-t pt-2">
              <p className="text-xs text-gray-400 mb-1">Final Decision</p>
              <p className="text-sm text-gray-700">{resolutionForm.finalDecision}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowResolutionWorkspace(false);
              setResolutionSuccess(false);
            }}
            className="px-6 py-2.5 bg-[#0f2744] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a5c] transition-colors"
          >
            Back to Disputes
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Dispute Overview */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dispute Overview</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Dispute Title</p>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedDispute.title}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Type</p>
                <p className="font-semibold text-gray-800 mt-0.5 capitalize">{selectedDispute.disputeType?.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Raised By</p>
                <p className="font-semibold text-gray-800 mt-0.5 capitalize">
                  {selectedDispute.raisedBy} — {selectedDispute.raisedBy === "client" ? selectedDispute.clientName : selectedDispute.freelancerName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Contract</p>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedDispute.jobTitle}</p>
              </div>
              {selectedDispute.escrowAmount && (
                <div>
                  <p className="text-gray-400 text-xs">Escrow</p>
                  <p className="font-semibold text-green-700 mt-0.5">₹{Number(selectedDispute.escrowAmount).toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h4 className="text-sm font-bold text-[#0f2744] border-b border-gray-100 pb-2">📋 Resolution Summary</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Resolution Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={resolutionForm.resolutionTitle}
                  onChange={(e) => setResolutionForm((f) => ({ ...f, resolutionTitle: e.target.value }))}
                  placeholder="e.g. Partial refund granted — quality issue confirmed"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Resolution Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "client_favor", l: "Client Favor" },
                    { v: "freelancer_favor", l: "Freelancer Favor" },
                    { v: "mutual_settlement", l: "Mutual Settlement" },
                    { v: "escrow_adjustment", l: "Escrow Adjustment" },
                    { v: "other", l: "Other" },
                  ].map((cat) => (
                    <button
                      key={cat.v}
                      onClick={() => setResolutionForm((f) => ({ ...f, resolutionCategory: cat.v }))}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        resolutionForm.resolutionCategory === cat.v ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0f2744]/30"
                      }`}
                    >
                      {cat.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Final Decision <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolutionForm.finalDecision}
                  onChange={(e) => setResolutionForm((f) => ({ ...f, finalDecision: e.target.value }))}
                  placeholder="Describe the final decision in detail. Visible to both parties..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Admin Notes <span className="text-gray-400 font-normal">(visible to parties)</span>
                </label>
                <textarea
                  value={resolutionForm.adminNotes}
                  onChange={(e) => setResolutionForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Internal Notes <span className="text-gray-400 font-normal">(admin only)</span>
                </label>
                <textarea
                  value={resolutionForm.internalNotes}
                  onChange={(e) => setResolutionForm((f) => ({ ...f, internalNotes: e.target.value }))}
                  placeholder="Internal notes not shared with parties..."
                  rows={2}
                  className="w-full px-3 py-2 border border-amber-200 bg-amber-50/30 rounded-xl text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Financial Decision */}
          {selectedDispute.escrowAmount && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-sm font-bold text-[#0f2744]">💰 Financial Decision</h4>
                <span className="text-xs text-gray-400">
                  Escrow: <span className="font-bold text-gray-700">₹{escrow.toLocaleString("en-IN")}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Refund Client (₹)</label>
                  <input
                    type="number"
                    value={resolutionForm.refundClientAmount}
                    onChange={(e) => setResolutionForm((f) => ({ ...f, refundClientAmount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Release Freelancer (₹)</label>
                  <input
                    type="number"
                    value={resolutionForm.releaseFreelancerAmount}
                    onChange={(e) => setResolutionForm((f) => ({ ...f, releaseFreelancerAmount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Platform Adj. (₹)</label>
                  <input
                    type="number"
                    value={resolutionForm.platformAdjustment}
                    onChange={(e) => setResolutionForm((f) => ({ ...f, platformAdjustment: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>
              {total > 0 && total !== escrow ? (
                <div className={`text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-2 ${total > escrow ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  <FiAlertTriangle size={12} />
                  Total: ₹{total.toLocaleString("en-IN")} — Escrow: ₹{escrow.toLocaleString("en-IN")}{" "}
                  {total > escrow ? "(exceeds!)" : "(diff: ₹" + (escrow - total).toLocaleString("en-IN") + ")"}
                </div>
              ) : total > 0 && total === escrow ? (
                <div className="text-xs px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium flex items-center gap-2">
                  <FiCheckCircle size={12} /> Matches escrow ✓
                </div>
              ) : null}
            </div>
          )}

          {/* Communication Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#0f2744] border-b border-gray-100 pb-2">⚙️ Communication Settings</h4>
            {[
              { k: "reopenChat", l: "Reopen Chat After Resolution", d: "Restore communication" },
              { k: "sendSystemMessage", l: "Send System Message to Both Parties", d: "Auto-post in chat" },
              { k: "notifyClient", l: "Notify Client", d: "In-app notification" },
              { k: "notifyFreelancer", l: "Notify Freelancer", d: "In-app notification" },
            ].map((s) => (
              <label key={s.k} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={resolutionForm[s.k as keyof ResolutionDraft] as boolean}
                  onChange={(e) => setResolutionForm((f) => ({ ...f, [s.k]: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#FF6B35]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.l}</p>
                  <p className="text-xs text-gray-400">{s.d}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Resolution Report Preview */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#0f2744] border-b border-gray-100 pb-2">📄 Resolution Report Preview</h4>
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3 text-sm">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <p className="text-xs text-gray-400">Case ID</p>
                  <p className="font-mono font-bold text-[#0f2744]">DISPUTE-{selectedDispute.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Resolution Date</p>
                  <p className="font-semibold text-gray-700">
                    {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400">Contract</p>
                  <p className="font-semibold">{selectedDispute.jobTitle}</p>
                </div>
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="font-semibold capitalize">{selectedDispute.disputeType?.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className="text-gray-400">Client</p>
                  <p className="font-semibold">{selectedDispute.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Freelancer</p>
                  <p className="font-semibold">{selectedDispute.freelancerName}</p>
                </div>
              </div>
              {resolutionForm.resolutionTitle && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-400 mb-1">Resolution</p>
                  <p className="font-semibold text-[#0f2744]">{resolutionForm.resolutionTitle}</p>
                  {resolutionForm.finalDecision && <p className="text-xs text-gray-600 mt-1">{resolutionForm.finalDecision}</p>}
                </div>
              )}
              <div className="text-xs text-gray-400 pt-2 border-t">
                Resolved by: Admin Team — {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-6">
            <button
              onClick={handleSaveDraft}
              disabled={resolutionSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0f2744] text-[#0f2744] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {resolutionSaving ? (
                <div className="w-4 h-4 border-2 border-[#0f2744]/30 border-t-[#0f2744] rounded-full animate-spin" />
              ) : (
                <FiSave size={14} />
              )}
              Save Draft
            </button>
            <button
              onClick={handlePublishResolution}
              disabled={resolutionPublishing || !resolutionForm.resolutionTitle.trim() || !resolutionForm.finalDecision.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resolutionPublishing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSend size={14} />
              )}
              {resolutionPublishing ? "Publishing..." : "Publish Resolution"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
