'use client';

import { useState } from 'react';
import { CheckCircle2, Copy, Check, ArrowRight, RefreshCw } from 'lucide-react';
import type { FeedbackSubmission } from '@/lib/types';

interface FeedbackSuccessModalProps {
  submission: FeedbackSubmission;
  onViewHistory: () => void;
  onReset: () => void;
}

export default function FeedbackSuccessModal({
  submission,
  onViewHistory,
  onReset,
}: FeedbackSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(submission.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6 md:p-8 bg-[var(--surface)] border border-emerald-500/30 text-center animate-fade-up max-w-2xl mx-auto relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
        <CheckCircle2 size={32} />
      </div>

      <h2 className="text-xl font-bold text-white mb-1">Feedback Submitted Successfully!</h2>
      <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mb-6">
        Thank you for helping us improve TrustPay. Your insights directly train and refine our risk intelligence system.
      </p>

      {/* Ticket ID Box */}
      <div className="bg-[var(--surface-2)] border border-[var(--border-light)] rounded-lg p-4 mb-6 max-w-sm mx-auto flex items-center justify-between">
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Tracking Reference Code
          </p>
          <p className="text-lg font-mono font-bold text-white tracking-wider">
            {submission.id}
          </p>
        </div>
        <button
          onClick={handleCopyId}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
          title="Copy Reference Code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="px-2.5 py-1 bg-[var(--surface-2)] border border-[var(--border-light)] rounded text-[11px] text-[var(--text-muted)]">
          Category: <strong className="text-white capitalize">{submission.category}</strong>
        </span>
        <span className="px-2.5 py-1 bg-[var(--surface-2)] border border-[var(--border-light)] rounded text-[11px] text-[var(--text-muted)]">
          Rating: <strong className="text-amber-400">{'★'.repeat(submission.rating)}</strong>
        </span>
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[11px] font-medium uppercase tracking-wider">
          Status: Under Review
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onViewHistory}
          className="btn-primary w-full sm:w-auto justify-center px-5 py-2.5 text-xs"
        >
          View Ticket in History
          <ArrowRight size={14} />
        </button>
        <button
          onClick={onReset}
          className="btn-secondary w-full sm:w-auto justify-center px-5 py-2.5 text-xs text-[var(--text-muted)] hover:text-white"
        >
          <RefreshCw size={13} />
          Submit Another Feedback
        </button>
      </div>
    </div>
  );
}
