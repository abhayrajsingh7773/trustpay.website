'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Bug,
  Target,
  Layout,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import type { FeedbackSubmission, FeedbackStatus, FeedbackCategory } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';

interface FeedbackHistoryProps {
  items: FeedbackSubmission[];
  onAddNew: () => void;
}

const CATEGORY_ICONS: Record<FeedbackCategory, any> = {
  bug: Bug,
  feature: Lightbulb,
  accuracy: Target,
  ui: Layout,
  security: Shield,
  general: MessageSquare,
};

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  submitted: {
    label: 'Submitted',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: Clock,
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: Clock,
  },
  investigating: {
    label: 'Investigating',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: AlertCircle,
  },
  planned: {
    label: 'Planned for Release',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    icon: Lightbulb,
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
};

const SENTIMENT_BADGES: Record<
  FeedbackSubmission['aiSentiment'],
  { label: string; text: string }
> = {
  positive: { label: 'Positive Experience', text: 'text-emerald-400' },
  neutral: { label: 'Neutral Inquiry', text: 'text-blue-400' },
  constructive: { label: 'Constructive Idea', text: 'text-amber-400' },
  urgent: { label: 'High Priority', text: 'text-red-400' },
};

export default function FeedbackHistory({ items, onAddNew }: FeedbackHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center animate-fade-up">
        <MessageSquare size={36} className="text-gray-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Feedback Submitted Yet</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-5">
          Have ideas, bug reports, or feedback on our risk detection? Submit your first feedback ticket.
        </p>
        <button onClick={onAddNew} className="btn-primary text-xs mx-auto">
          Submit Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between px-1">
        <p className="label-section">Feedback Ticket History ({items.length})</p>
        <button
          onClick={onAddNew}
          className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
        >
          + Submit New Feedback
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const CategoryIcon = CATEGORY_ICONS[item.category] || MessageSquare;
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;
          const StatusIcon = status.icon;
          const isExpanded = expandedId === item.id;
          const sentiment = SENTIMENT_BADGES[item.aiSentiment];

          return (
            <div
              key={item.id}
              className="card overflow-hidden transition-all border hover:border-gray-700"
            >
              {/* Card Header Header */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 flex items-center justify-between cursor-pointer bg-[var(--surface)] hover:bg-[var(--surface-2)]/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border-light)] flex items-center justify-center text-red-400 flex-shrink-0">
                    <CategoryIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {item.id}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] px-1.5 py-0.5 bg-gray-800 rounded">
                        {item.category}
                      </span>
                      <div className="flex items-center text-amber-400 text-xs">
                        {'★'.repeat(item.rating)}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white truncate mt-0.5">
                      {item.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  {/* Status Badge */}
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
                  >
                    <StatusIcon size={11} />
                    {status.label}
                  </span>

                  <span className="text-[11px] font-mono text-[var(--text-muted)] hidden md:inline">
                    {formatDateShort(item.createdAt)}
                  </span>

                  <button className="text-gray-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Card Body (Expanded) */}
              {isExpanded && (
                <div className="p-4 md:p-5 border-t border-[var(--border)] bg-[var(--surface-2)]/40 space-y-4">
                  {/* Description */}
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">
                      Submitted Description
                    </p>
                    <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--bg)] p-3 rounded border border-[var(--border)]">
                      {item.description}
                    </p>
                  </div>

                  {/* System Scores Breakdown */}
                  {item.satisfactionScores && (
                    <div>
                      <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1.5">
                        Performance Metrics
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[var(--surface)] p-2 rounded border border-[var(--border)] text-center">
                          <p className="text-[10px] text-[var(--text-muted)]">Risk Accuracy</p>
                          <p className="text-xs font-mono font-bold text-white">
                            {item.satisfactionScores.riskAccuracy}%
                          </p>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded border border-[var(--border)] text-center">
                          <p className="text-[10px] text-[var(--text-muted)]">Performance</p>
                          <p className="text-xs font-mono font-bold text-white">
                            {item.satisfactionScores.performance}%
                          </p>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded border border-[var(--border)] text-center">
                          <p className="text-[10px] text-[var(--text-muted)]">UI Clarity</p>
                          <p className="text-xs font-mono font-bold text-white">
                            {item.satisfactionScores.clarity}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Official Response Banner */}
                  {item.officialResponse && (
                    <div className="bg-red-500/5 border border-red-500/20 p-3.5 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
                        <MessageCircle size={14} />
                        <span>TrustPay Intelligence Team Response</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {item.officialResponse}
                      </p>
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-2 text-[10px] text-[var(--text-muted)] border-t border-[var(--border-light)]">
                    <span className="flex items-center gap-1">
                      AI Sentiment Tag:{' '}
                      <strong className={sentiment.text}>{sentiment.label}</strong>
                    </span>
                    {item.email && <span>Follow-up: {item.email}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
