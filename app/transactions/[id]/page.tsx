'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Cpu, Clock, MessageSquare, Hash } from 'lucide-react';
import { getTransaction } from '@/lib/api';
import { MOCK_BEHAVIOR_PROFILE } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';
import { formatCurrency, formatDate, getScoreColor } from '@/lib/utils';
import RiskGauge from '@/components/ui/RiskGauge';
import RiskBadge from '@/components/ui/RiskBadge';
import RiskSignalCard from '@/components/ui/RiskSignalCard';
import ProgressBar from '@/components/ui/ProgressBar';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [txn, setTxn] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTransaction(id).then((t) => {
      if (!t) setNotFound(true);
      else setTxn(t);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-1">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>
    );
  }

  if (notFound || !txn) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[var(--text-muted)]">Transaction not found.</p>
        <Link href="/transactions" className="btn-secondary">
          <ArrowLeft size={13} />
          Back to Transactions
        </Link>
      </div>
    );
  }

  const profile = MOCK_BEHAVIOR_PROFILE;
  const amountMultiplier = txn.amount / profile.averageAmount;

  // Compute risk breakdown scores from reasons
  const getReason = (type: string) => txn.reasons.find((r) => r.type.startsWith(type));
  const amountReason = getReason('amount');
  const recipientReason = getReason('new_recipient');
  const deviceReason = getReason('new_device');
  const locationReason = getReason('location');
  const messageReason = getReason('message');

  return (
    <div className="p-6 lg:p-8 space-y-5 animate-fade-up max-w-3xl">
      {/* Back */}
      <button onClick={() => router.push('/transactions')} className="btn-ghost text-[12px] -ml-2">
        <ArrowLeft size={13} />
        Back to Transactions
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="label-section mb-1">Transaction Detail</p>
          <h1 className="text-[20px] font-bold text-white">{formatCurrency(txn.amount)}</h1>
          <p className="text-[13px] text-[var(--text-muted)]">→ {txn.recipientName} ({txn.recipient})</p>
        </div>
        <RiskBadge level={txn.riskLevel} />
      </div>

      {/* Details Grid + Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metadata */}
        <div className="card p-4 space-y-3 text-[12px]">
          <p className="label-section">Transaction Metadata</p>
          {[
            { label: 'Transaction ID', value: txn.id, mono: true, icon: <Hash size={11} /> },
            { label: 'Timestamp', value: formatDate(txn.timestamp), icon: <Clock size={11} /> },
            { label: 'Location', value: `${txn.location.city}${txn.location.state ? ', ' + txn.location.state : ''}`, icon: <MapPin size={11} />, highlight: txn.isNewDevice },
            { label: 'Device', value: txn.deviceName, icon: <Cpu size={11} />, highlight: txn.isNewDevice },
            { label: 'Category', value: txn.category || 'Unknown' },
            { label: 'Status', value: txn.status, capitalize: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-1 text-[var(--text-muted)] flex-shrink-0">
                {row.icon}
                {row.label}
              </div>
              <span
                className={`${row.mono ? 'font-mono text-[10px]' : ''} ${
                  row.highlight ? 'text-red-400' : 'text-white'
                } ${row.capitalize ? 'capitalize' : ''} text-right max-w-[60%] break-all`}
              >
                {row.value}
              </span>
            </div>
          ))}
          {txn.message && (
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
                <MessageSquare size={11} />
                Message
              </div>
              <p className="text-white italic text-[12px]">&ldquo;{txn.message}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Gauge */}
        <div className="card p-4 flex flex-col items-center justify-center">
          <RiskGauge score={txn.riskScore} size={160} />
          <div className="w-full mt-3 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Amount vs. baseline</span>
              <span style={{ color: getScoreColor(txn.riskScore) }}>
                {amountMultiplier.toFixed(1)}×
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Recipient</span>
              <span className={txn.isNewRecipient ? 'text-red-400' : 'text-emerald-400'}>
                {txn.isNewRecipient ? 'First-time' : 'Known'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Device</span>
              <span className={txn.isNewDevice ? 'text-red-400' : 'text-emerald-400'}>
                {txn.isNewDevice ? 'Unrecognized' : 'Trusted'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="card p-5">
        <p className="label-section mb-4">Risk Breakdown</p>
        <div className="space-y-3 text-[12px]">
          {[
            {
              label: 'Amount anomaly',
              value: amountReason ? amountReason.contribution : 5,
              level: amountReason?.severity || 'LOW',
            },
            {
              label: 'Recipient history',
              value: recipientReason ? recipientReason.contribution : 5,
              level: recipientReason?.severity || 'LOW',
            },
            {
              label: 'Device anomaly',
              value: deviceReason ? deviceReason.contribution : 5,
              level: deviceReason?.severity || 'LOW',
            },
            {
              label: 'Location anomaly',
              value: locationReason ? locationReason.contribution : 5,
              level: locationReason?.severity || 'LOW',
            },
            {
              label: 'Message signal',
              value: messageReason ? messageReason.contribution : 0,
              level: messageReason?.severity || 'LOW',
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[var(--text-muted)]">{item.label}</span>
                <span
                  className={`text-[10px] font-bold ${
                    item.level === 'HIGH'
                      ? 'text-red-400'
                      : item.level === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
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

      {/* Behavioral Context */}
      <div className="card p-5">
        <p className="label-section mb-3">Behavioral Context</p>
        <div className="grid grid-cols-2 gap-4 text-[12px]">
          <div className="space-y-1">
            <p className="text-[var(--text-muted)]">Your normal payment</p>
            <p className="text-[16px] font-semibold text-white">
              ₹{profile.typicalRange.min} – ₹{profile.typicalRange.max.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-muted)]">This payment</p>
            <p className={`text-[16px] font-semibold ${txn.amount > profile.typicalRange.max ? 'text-red-400' : 'text-white'}`}>
              {formatCurrency(txn.amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-muted)]">Usual recipient frequency</p>
            <p className="text-white">{profile.averageDailyTransactions} payments/day avg.</p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--text-muted)]">Usual locations</p>
            <p className="text-white">{profile.commonLocations.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Risk Signals */}
      {txn.reasons.length > 0 && (
        <div>
          <p className="label-section mb-3">Risk Signals</p>
          <div className="space-y-2.5">
            {txn.reasons.map((r, i) => (
              <RiskSignalCard key={r.type} reason={r} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
