'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, TrendingUp, ArrowRight, Clock, Users, Smartphone, MapPin, Cpu } from 'lucide-react';
import { getTransactions, getBehaviorProfile } from '@/lib/api';
import { MOCK_DAILY_RISK_DATA } from '@/lib/mock-data';
import type { Transaction, BehaviorProfile } from '@/lib/types';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import StatCard from '@/components/ui/StatCard';
import RiskGauge from '@/components/ui/RiskGauge';
import RiskBadge from '@/components/ui/RiskBadge';
import RiskChart from '@/components/charts/RiskChart';

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<BehaviorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTransactions(), getBehaviorProfile()]).then(([txns, prof]) => {
      setTransactions(txns);
      setProfile(prof);
      setLoading(false);
    });
  }, []);

  const recentTxns = transactions.slice(0, 7);
  const highRiskTxns = transactions.filter((t) => t.riskLevel === 'HIGH').length;
  const todayTxns = transactions.filter(
    (t) => new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).length;

  // Current overall risk = max risk of recent transactions or last known score
  const currentRiskScore = transactions[0]?.riskScore ?? 18;

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="label-section mb-1">Overview</p>
          <h1 className="text-[22px] font-bold text-white">Good morning, Ayush</h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Here&apos;s what&apos;s happening with your payment activity.
          </p>
        </div>
        <Link href="/payment" className="btn-primary hidden sm:flex" id="dash-new-payment">
          New Payment
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Risk Status"
          value={currentRiskScore >= 60 ? 'HIGH' : currentRiskScore >= 30 ? 'MEDIUM' : 'NORMAL'}
          sub={`Score: ${currentRiskScore}/100`}
          accent={currentRiskScore >= 60}
          icon={<Shield size={15} />}
        />
        <StatCard
          label="Transactions Today"
          value={todayTxns || 7}
          sub="vs. avg 5/day"
          icon={<Clock size={15} />}
        />
        <StatCard
          label="Known Recipients"
          value={profile?.knownRecipients ?? 12}
          sub="Trusted contacts"
          icon={<Users size={15} />}
        />
        <StatCard
          label="Trusted Devices"
          value={profile?.trustedDevices ?? 2}
          sub="Registered devices"
          icon={<Smartphone size={15} />}
        />
      </div>

      {/* Risk overview + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Gauge */}
        <div className="card p-5 flex flex-col items-center lg:col-span-1">
          <div className="flex items-center justify-between w-full mb-4">
            <div>
              <p className="label-section">Payment Risk Overview</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Current session</p>
            </div>
          </div>
          <RiskGauge score={currentRiskScore} size={180} />
          <p className="text-[11px] text-[var(--text-muted)] text-center mt-3 max-w-[180px] leading-relaxed">
            {currentRiskScore < 30
              ? 'Current activity is consistent with your usual payment behavior.'
              : currentRiskScore < 60
              ? 'Some unusual signals detected. Review recent transactions.'
              : 'High-risk activity detected. Immediate review recommended.'}
          </p>
        </div>

        {/* 7-day chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-section">7-Day Risk Trend</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Risk Score
                </span>
                {' · '}
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Transactions
                </span>
              </p>
            </div>
            {highRiskTxns > 0 && (
              <span className="risk-badge risk-badge-high text-[10px]">
                {highRiskTxns} High-risk
              </span>
            )}
          </div>
          <RiskChart data={MOCK_DAILY_RISK_DATA} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <p className="label-section">Recent Transactions</p>
          <Link href="/transactions" className="text-[12px] text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th className="hidden md:table-cell">Location</th>
                  <th className="hidden lg:table-cell">Device</th>
                  <th>Risk</th>
                  <th className="hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((txn) => (
                  <tr key={txn.id} onClick={() => router.push(`/transactions/${txn.id}`)}>
                    <td className="text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateShort(txn.timestamp)}
                    </td>
                    <td>
                      <div>
                        <p className="text-[13px] font-medium text-white">{txn.recipientName}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)]">{txn.recipient}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-[13px] whitespace-nowrap">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="hidden md:table-cell text-[12px] text-[var(--text-muted)] whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="flex-shrink-0" />
                        {txn.location.city}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell text-[11px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <Cpu size={10} />
                        {txn.deviceName}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <RiskBadge level={txn.riskLevel} size="sm" />
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">
                          {txn.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span
                        className={`text-[11px] font-medium capitalize ${
                          txn.status === 'completed'
                            ? 'text-emerald-400'
                            : txn.status === 'blocked'
                            ? 'text-red-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
