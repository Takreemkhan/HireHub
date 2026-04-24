'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface ApplicationFormProps {
  projectTitle: string;
  jobId: string; // Add jobId prop
  onSubmit: () => void;
}

const ApplicationForm = ({ projectTitle, jobId, onSubmit }: ApplicationFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation (API requires proposalText min 50 chars)
    if (coverLetter.trim().length < 50) {
      setError('Cover letter must be at least 50 characters');
      return;
    }

    if (!proposedRate || Number(proposedRate) <= 0) {
      setError('Please enter a valid rate');
      return;
    }

    if (!estimatedDuration) {
      setError('Please select an estimated duration');
      return;
    }

    // Check if user is logged in
    if (!session) {
      router.push('/sign-in-page');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      /*
       * POST /api/proposals - matches backend API (jobId, proposalText, bidAmount, coverLetter, estimatedDuration, attachments)
       * Auth: NextAuth session cookie (sent automatically)
       */
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          proposalText: coverLetter.trim(),
          bidAmount: Number(proposedRate),
          coverLetter: coverLetter.trim(),
          estimatedDuration: estimatedDuration || undefined,
          attachments: attachments.length ? attachments : undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError('You have already submitted a proposal for this job.');
        return;
      }

      if (res.status === 404) {
        setError(data.message || 'Job not found or no longer accepting proposals.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit proposal');
      }

      // Success!
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
        // Optionally redirect to "My Proposals" page
        // router.push('/freelancer-dashboard/my-proposals');
      }, 2000);

    } catch (err: any) {
      console.error('Proposal submission error:', err);
      setError(err.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAttachment = () => {
    setAttachments([...attachments, `Portfolio_Sample_${attachments.length + 1}.pdf`]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-card rounded-lg shadow-brand p-6">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center">
        <Icon name="PaperAirplaneIcon" size={24} className="mr-2 text-primary" />
        Submit Your Proposal
      </h2>

      {showSuccess ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green/10 rounded-full mb-4">
            <Icon name="CheckCircleIcon" size={32} className="text-brand-green" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Proposal Submitted Successfully!
          </h3>
          <p className="text-muted-foreground">
            The client will review your proposal and contact you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Letter *
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows={6}
              placeholder="Explain why you're the best fit for this project. Highlight relevant experience and how you'll approach the work..."
              className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {coverLetter.length}/50 characters minimum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Proposed Rate (£) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  £
                </span>
                <input
                  type="number"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  required
                  min="1"
                  placeholder="5000"
                  className="w-full pl-8 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estimated Duration *
              </label>
              <select
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select duration</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Attachments (Optional)
            </label>
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="DocumentIcon" size={20} className="text-primary" />
                    <span className="text-sm text-foreground">{attachment}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Icon name="XMarkIcon" size={18} className="text-destructive" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAttachment}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-input rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Icon name="PlusIcon" size={20} className="text-primary" />
                <span className="text-sm font-medium text-primary">Add Portfolio Sample</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="InformationCircleIcon" size={20} className="text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Application Tips
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Personalize your cover letter for this specific project</li>
                  <li>• Highlight relevant experience and past work</li>
                  <li>• Be realistic with your timeline and budget</li>
                  <li>• Include portfolio samples that showcase similar work</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => onSubmit()}
              className="px-6 py-3 text-foreground hover:bg-muted rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-display font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                submitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-brand-cta text-white hover:bg-opacity-90'
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Proposal</span>
                  <Icon name="ArrowRightIcon" size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ApplicationForm;