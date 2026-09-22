'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquarePlus,
  History,
  ShieldCheck,
  Zap,
  Clock,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { FeedbackSubmission } from '@/lib/types';
import { getFeedbackHistory } from '@/lib/api';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackHistory from '@/components/feedback/FeedbackHistory';

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [historyItems, setHistoryItems] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getFeedbackHistory();
      setHistoryItems(data);
    } catch (e) {
      console.error('Failed to load feedback history', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmissionSuccess = (newSubmission: FeedbackSubmission) => {
    setHistoryItems((prev) => [newSubmission, ...prev]);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="label-section">Feedback & Support</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-500/10 border border-red-500/30 text-red-400">
              Risk Intelligence Lab
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            App Feedback & Ticket Hub
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl">
            Help train our continuous risk models and refine payment workflow UI. Every report is reviewed by our engineering and security teams.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center bg-[var(--surface-2)] p-1 rounded-lg border border-[var(--border-light)] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'submit'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <MessageSquarePlus size={14} />
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <History size={14} />
            Ticket History ({historyItems.length})
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
              Model Accuracy Rate
            </p>
            <p className="text-lg font-bold text-white font-mono">99.4%</p>
            <p className="text-[10px] text-emerald-400">Validated by user feedback</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
              Avg. Review Time
            </p>
            <p className="text-lg font-bold text-white font-mono">&lt; 2.4 Hours</p>
            <p className="text-[10px] text-blue-400">Security team triage SLA</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
              Community Satisfaction
            </p>
            <p className="text-lg font-bold text-white font-mono">4.9 / 5.0</p>
            <p className="text-[10px] text-amber-400">Based on 1.2k+ submissions</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'submit' ? (
            <FeedbackForm
              onSuccess={handleSubmissionSuccess}
              onViewHistory={() => setActiveTab('history')}
            />
          ) : loading ? (
            <div className="card p-12 text-center">
              <div className="flex justify-center gap-1.5 mb-2">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
              <p className="text-xs text-[var(--text-muted)]">Loading ticket history...</p>
            </div>
          ) : (
            <FeedbackHistory
              items={historyItems}
              onAddNew={() => setActiveTab('submit')}
            />
          )}
        </div>

        {/* Sidebar Info & FAQ Cards */}
        <div className="space-y-4">
          {/* Quick Guidance Box */}
          <div className="card p-5 bg-[var(--surface-2)]/60 border border-[var(--border-light)] space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles size={16} className="text-red-400" />
              <span>How your feedback is used</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              When you submit feedback on risk detection or UI clarity, our AI engine updates model calibration weights to reduce false positives for your behavior profile.
            </p>

            <div className="border-t border-[var(--border)] pt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>Model Calibration</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>SLA Response Window</span>
                <span className="text-white font-mono">24h Priority</span>
              </div>
            </div>
          </div>

          {/* Need Urgent Support Card */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <HelpCircle size={16} className="text-blue-400" />
              <span>Urgent Security Concerns?</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              If you suspect fraudulent account access or unauthorized transaction activity, lock your payment session immediately from Risk Analysis.
            </p>
            <a
              href="/analysis"
              className="btn-secondary w-full text-xs justify-center py-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              Open Risk Analysis
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
