'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  XCircle,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import type { AnalyzeTransactionResponse } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import RiskGauge from '@/components/ui/RiskGauge';
import RiskSignalCard from '@/components/ui/RiskSignalCard';
import ProgressBar from '@/components/ui/ProgressBar';

export default function AnalysisPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyzeTransactionResponse | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('trustpay_analysis');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert size={40} className="text-[var(--text-muted)]" />
        <p className="text-[var(--text-muted)] text-center">
          No analysis data found. Please analyze a payment first.
        </p>
        <Link href="/payment" className="btn-primary">
          Analyze a Payment
        </Link>
      </div>
    );
  }

  const { transaction: txn, behaviorComparison: cmp } = data;

  if (cancelled) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-[20px] font-bold text-white">Payment Cancelled</h2>
        <p className="text-[var(--text-muted)] text-center max-w-xs">
          The payment has been cancelled. Your funds are safe.
        </p>
        <Link href="/payment" className="btn-primary" id="make-new-payment-btn">
          Make a New Payment
        </Link>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} className="text-amber-400" />
        </div>
        <h2 className="text-[20px] font-bold text-white">Verification Required</h2>
        <p className="text-[var(--text-muted)] text-center max-w-sm">
          Please independently verify the recipient before completing this payment.
          TrustPay cannot confirm the legitimacy of this transaction.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setVerified(false)} className="btn-secondary">
            Back to Analysis
          </button>
          <Link href="/payment" className="btn-primary" id="proceed-anyway-btn">
            I&apos;ve Verified — Proceed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.push('/payment')}
        className="btn-ghost text-[12px] -ml-2"
        id="back-to-payment-btn"
      >
        <ArrowLeft size={13} />
        Back to Payment
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="label-section mb-1">Risk Analysis Result</p>
          <h1 className="text-[22px] font-bold text-white">Transaction Risk Report</h1>
        </div>
        <button
          onClick={() => router.push('/payment')}
          className="btn-ghost text-[12px]"
          id="re-analyze-btn"
        >
          <RefreshCw size={13} />
          Re-analyze
        </button>
      </div>

      {/* Transaction Summary + Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transaction info */}
        <div className="card p-5">
          <p className="label-section mb-3">Transaction Details</p>
          <div className="space-y-2.5">
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Amount</p>
              <p className="text-[28px] font-bold text-white">{formatCurrency(txn.amount)}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[var(--text-muted)] text-[12px]">→</span>
              <div>
                <p className="text-[13px] font-medium text-white">{txn.recipientName}</p>
                <p className="font-mono text-[11px] text-[var(--text-muted)]">{txn.recipient}</p>
              </div>
            </div>
            <div className="pt-1 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-[var(--text-muted)]">Device</p>
                <p className={txn.isNewDevice ? 'text-red-400' : 'text-white'}>{txn.deviceName}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Location</p>
                <p className={cmp.locationStatus === 'unusual' ? 'text-red-400' : 'text-white'}>
                  {txn.location.city}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Recipient</p>
                <p className={txn.isNewRecipient ? 'text-red-400' : 'text-emerald-400'}>
                  {cmp.recipientStatus === 'new' ? 'First-time' : 'Known'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Amount vs. avg</p>
                <p className={cmp.amountVsAverage > 5 ? 'text-red-400' : 'text-amber-400'}>
                  {cmp.amountVsAverage}×
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Gauge */}
        <div className="card p-5 flex flex-col items-center justify-center">
          <RiskGauge score={txn.riskScore} size={180} />
          {txn.message && (
            <div className="mt-3 p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] w-full">
              <p className="text-[10px] text-[var(--text-muted)] mb-1">Payment Message</p>
              <p className="text-[12px] text-white italic">&ldquo;{txn.message}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Signals */}
      {txn.reasons.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={15} className="text-red-400" />
            <p className="label-section text-[11px]">Why Is This Payment Unusual?</p>
          </div>
          <div className="space-y-2.5">
            {txn.reasons.map((reason, i) => (
              <RiskSignalCard key={reason.type} reason={reason} index={i} />
            ))}
          </div>
        </div>
      )}

      {txn.reasons.length === 0 && (
        <div className="card p-5 border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[13px] text-emerald-400 font-medium">
            ✓ No significant risk signals detected. This payment appears consistent with your
            normal behavior.
          </p>
        </div>
      )}

      {/* Behavioral Comparison */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-[var(--text-muted)]" />
          <p className="label-section">Behavioral Comparison</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Your normal range</span>
                <span className="font-mono">₹100 – ₹1,500</span>
              </div>
              <ProgressBar value={15} color="#22c55e" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--text-muted)]">Current payment</span>
                <span className="font-mono text-red-400">{formatCurrency(txn.amount)}</span>
              </div>
              <ProgressBar value={Math.min(100, (txn.amount / 60000) * 100)} color="#ef4444" />
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                label: 'Amount anomaly',
                value: Math.min(100, cmp.amountVsAverage * 5),
                level: txn.riskLevel,
              },
              {
                label: 'Recipient history',
                value: cmp.recipientStatus === 'new' ? 85 : 15,
                level: cmp.recipientStatus === 'new' ? 'HIGH' : 'LOW',
              },
              {
                label: 'Device trust',
                value: cmp.deviceStatus === 'new' ? 80 : 10,
                level: cmp.deviceStatus === 'new' ? 'HIGH' : 'LOW',
              },
              {
                label: 'Location signal',
                value: cmp.locationStatus === 'unusual' ? 60 : 10,
                level: cmp.locationStatus === 'unusual' ? 'MEDIUM' : 'LOW',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">{item.label}</span>
                  <span
                    className={
                      item.level === 'HIGH'
                        ? 'text-red-400 text-[10px] font-bold'
                        : item.level === 'MEDIUM'
                        ? 'text-amber-400 text-[10px] font-bold'
                        : 'text-emerald-400 text-[10px] font-bold'
                    }
                  >
                    {item.level}
                  </span>
                </div>
                <ProgressBar
                  value={item.value}
                  color={
                    item.level === 'HIGH'
                      ? '#ef4444'
                      : item.level === 'MEDIUM'
                      ? '#f59e0b'
                      : '#22c55e'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div
        className={`card p-5 ${
          txn.riskScore >= 60
            ? 'border-red-500/20 bg-red-500/5'
            : txn.riskScore >= 30
            ? 'border-amber-500/20 bg-amber-500/5'
            : 'border-emerald-500/20 bg-emerald-500/5'
        }`}
      >
        <p className="label-section mb-2">Recommended Action</p>
        <p className="text-[14px] font-semibold text-white mb-1">
          {txn.riskScore >= 60
            ? 'Do not send this payment until the recipient has been independently verified.'
            : txn.riskScore >= 30
            ? 'Proceed with caution. Verify the recipient before sending.'
            : 'This payment appears consistent with your behavior. Proceed normally.'}
        </p>
        <p className="text-[12px] text-[var(--text-muted)] mb-4">
          Risk scores are not a guarantee of fraud. Always independently verify
          suspicious payment requests through official channels.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setCancelled(true)}
            className="btn-primary flex-1 justify-center"
            id="cancel-payment-btn"
          >
            <XCircle size={14} />
            Cancel Payment
          </button>
          <button
            onClick={() => setVerified(true)}
            className="btn-secondary flex-1 justify-center"
            id="verify-continue-btn"
          >
            <CheckCircle size={14} />
            Verify &amp; Continue
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2">
        <AlertTriangle size={11} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          TrustPay is a prototype for demonstration purposes. Risk signals are based on behavioral
          pattern analysis and contextual heuristics. This is not a definitive fraud determination.
        </p>
      </div>
    </div>
  );
}
