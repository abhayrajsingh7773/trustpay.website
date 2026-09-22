'use client';

import { useState } from 'react';
import {
  Star,
  Bug,
  Lightbulb,
  Target,
  Layout,
  Shield,
  MessageSquare,
  Paperclip,
  X,
  Send,
  Sparkles,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import type { FeedbackCategory, SubmitFeedbackRequest, FeedbackSubmission } from '@/lib/types';
import { submitFeedback } from '@/lib/api';
import FeedbackSuccessModal from './FeedbackSuccessModal';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: any; desc: string }[] = [
  { id: 'bug', label: 'Bug Report', icon: Bug, desc: 'Report an issue or unexpected error' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, desc: 'Suggest new capability or enhancement' },
  { id: 'accuracy', label: 'Risk Accuracy', icon: Target, desc: 'Feedback on risk score precision' },
  { id: 'ui', label: 'UI & UX', icon: Layout, desc: 'Visual design & usability experience' },
  { id: 'security', label: 'Security Concern', icon: Shield, desc: 'Report security or privacy concerns' },
  { id: 'general', label: 'General Feedback', icon: MessageSquare, desc: 'General thoughts or inquiries' },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Unsatisfactory - Needs major improvement',
  2: 'Fair - Needs improvement',
  3: 'Good - Met expectations',
  4: 'Very Good - Impressed',
  5: 'Exceptional - Outstanding experience',
};

interface FeedbackFormProps {
  onSuccess: (submission: FeedbackSubmission) => void;
  onViewHistory: () => void;
}

export default function FeedbackForm({ onSuccess, onViewHistory }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackCategory>('accuracy');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [riskAccuracyScore, setRiskAccuracyScore] = useState(90);
  const [performanceScore, setPerformanceScore] = useState(85);
  const [clarityScore, setClarityScore] = useState(95);
  const [email, setEmail] = useState('ayush.sharma@okaxis');
  const [allowFollowUp, setAllowFollowUp] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<FeedbackSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide a subject title.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a detailed description (at least 10 characters).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload: SubmitFeedbackRequest = {
        category,
        rating,
        subject: subject.trim(),
        description: description.trim(),
        satisfactionScores: {
          riskAccuracy: riskAccuracyScore,
          performance: performanceScore,
          clarity: clarityScore,
        },
        email: allowFollowUp ? email.trim() : undefined,
        allowFollowUp,
        attachmentName: attachment ? attachment.name : undefined,
      };

      const result = await submitFeedback(payload);
      setSubmittedItem(result);
      onSuccess(result);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedItem) {
    return (
      <FeedbackSuccessModal
        submission={submittedItem}
        onViewHistory={onViewHistory}
        onReset={() => {
          setSubmittedItem(null);
          setSubject('');
          setDescription('');
          setAttachment(null);
        }}
      />
    );
  }

  const activeRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="card p-5 md:p-7 space-y-6 animate-fade-up">
      {/* Top Banner / Info */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Submit Feedback
            <Sparkles size={16} className="text-amber-400" />
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Your feedback helps us continuously improve TrustPay&apos;s risk detection algorithms and app design.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded flex items-center gap-2">
          <X size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Category Selection */}
      <div>
        <label className="label-section mb-2.5 block">1. Select Feedback Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500/50 text-white shadow-lg shadow-red-500/5'
                    : 'bg-[var(--surface-2)] border-[var(--border-light)] text-[var(--text-muted)] hover:text-white hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon size={16} className={isSelected ? 'text-red-400' : 'text-gray-400'} />
                  {isSelected && <CheckCircle size={14} className="text-red-400" />}
                </div>
                <span className="text-xs font-semibold text-white block">{cat.label}</span>
                <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Rating Scale */}
      <div>
        <label className="label-section mb-2 block">2. Overall Rating</label>
        <div className="bg-[var(--surface-2)] border border-[var(--border-light)] rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1.5 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={26}
                  className={`transition-colors ${
                    star <= activeRating
                      ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-amber-400 transition-all">
            {RATING_LABELS[activeRating]}
          </p>
        </div>
      </div>

      {/* 3. Detailed Feedback */}
      <div className="space-y-4">
        <label className="label-section block">3. Feedback Details</label>

        {/* Subject */}
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">
            Subject Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Unusual login risk alert was clear and accurate"
            className="input-field"
            maxLength={100}
            required
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <span className="text-[10px] text-[var(--text-muted)]">
              {description.length}/500 chars
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your experience, what went well, or what could be improved..."
            rows={4}
            className="input-field resize-none"
            maxLength={500}
            required
          />
        </div>
      </div>

      {/* 4. Feature Satisfaction Sliders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label-section flex items-center gap-1.5">
            <Sliders size={13} />
            4. System Performance Ratings
          </label>
        </div>
        <div className="space-y-3 bg-[var(--surface-2)] border border-[var(--border-light)] p-4 rounded-lg">
          {/* Risk Engine Accuracy */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-muted)]">Risk Detection Precision</span>
              <span className="font-mono text-white font-semibold">{riskAccuracyScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={riskAccuracyScore}
              onChange={(e) => setRiskAccuracyScore(Number(e.target.value))}
              className="w-full accent-red-500 bg-gray-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* Speed & Performance */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-muted)]">App Speed & Response Latency</span>
              <span className="font-mono text-white font-semibold">{performanceScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={performanceScore}
              onChange={(e) => setPerformanceScore(Number(e.target.value))}
              className="w-full accent-red-500 bg-gray-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          {/* UI Clarity */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-muted)]">UI & Risk Signal Clarity</span>
              <span className="font-mono text-white font-semibold">{clarityScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={clarityScore}
              onChange={(e) => setClarityScore(Number(e.target.value))}
              className="w-full accent-red-500 bg-gray-800 rounded h-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5. Attachment Dropzone */}
      <div>
        <label className="label-section mb-2 block">5. Attach Screenshots / Logs (Optional)</label>
        <div className="border border-dashed border-[var(--border-light)] hover:border-red-500/50 rounded-lg p-4 text-center bg-[var(--surface-2)]/50 transition-colors relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.log,.pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Paperclip size={18} className="text-gray-400" />
            {attachment ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span>{attachment.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAttachment(null);
                  }}
                  className="text-gray-400 hover:text-red-400 p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-white">Click or drag a screenshot / log file here</p>
                <p className="text-[10px] text-[var(--text-muted)]">Supports PNG, JPG, PDF up to 10MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 6. Contact Follow-up Options */}
      <div className="bg-[var(--surface-2)] border border-[var(--border-light)] p-3.5 rounded-lg space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={allowFollowUp}
            onChange={(e) => setAllowFollowUp(e.target.checked)}
            className="rounded accent-red-500 w-4 h-4"
          />
          <span className="text-xs text-white font-medium">
            Allow TrustPay risk intelligence team to follow up with me regarding this feedback
          </span>
        </label>

        {allowFollowUp && (
          <div className="pl-6 pt-1">
            <label className="text-[11px] text-[var(--text-muted)] mb-1 block">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="input-field text-xs py-1.5"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onViewHistory}
          className="btn-secondary text-xs text-[var(--text-muted)] hover:text-white"
        >
          Cancel & View History
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span>Submit Feedback</span>
              <Send size={13} />
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
