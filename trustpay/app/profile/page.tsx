'use client';

import { useEffect, useState } from 'react';
import { User, MapPin, Smartphone, TrendingUp, Clock, BarChart2 } from 'lucide-react';
import { getBehaviorProfile } from '@/lib/api';
import { MOCK_AMOUNT_DISTRIBUTION, MOCK_HOURLY_DATA } from '@/lib/mock-data';
import type { BehaviorProfile } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import AmountDistribution from '@/components/charts/AmountDistribution';
import HourlyChart from '@/components/charts/HourlyChart';

export default function ProfilePage() {
  const [profile, setProfile] = useState<BehaviorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBehaviorProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  if (loading || !profile) {
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

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[16px] font-bold text-red-400 flex-shrink-0">
          AS
        </div>
        <div>
          <p className="label-section mb-1">Behavior Profile</p>
          <h1 className="text-[22px] font-bold text-white">Ayush Sharma</h1>
          <p className="text-[13px] text-[var(--text-muted)]">
            ayush.sharma@okaxis · {profile.totalTransactions} transactions analyzed
          </p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="card p-4 border-blue-500/15 bg-blue-500/5">
        <p className="text-[12px] text-[#93c5fd] leading-relaxed">
          <strong>How TrustPay Works:</strong> The system learns your normal payment behavior and
          uses it as a baseline. New transactions are compared against this profile to detect
          anomalies. TrustPay does not rely only on a fixed transaction threshold — it compares new
          activity against your historical behavioral pattern.
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <p className="label-section mb-3">Behavioral Baseline</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Average Transaction',
              value: formatCurrency(profile.averageAmount),
              icon: <TrendingUp size={14} />,
            },
            {
              label: 'Median Transaction',
              value: formatCurrency(profile.medianAmount),
              icon: <BarChart2 size={14} />,
            },
            {
              label: 'Typical Range',
              value: `₹${profile.typicalRange.min} – ₹${profile.typicalRange.max.toLocaleString('en-IN')}`,
              icon: <BarChart2 size={14} />,
            },
            {
              label: 'Daily Avg. Transactions',
              value: profile.averageDailyTransactions,
              icon: <Clock size={14} />,
            },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-2">
                {s.icon}
                <span className="label-section text-[10px]">{s.label}</span>
              </div>
              <p className="text-[18px] font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recipients & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-[var(--text-muted)]" />
            <p className="label-section">Known Recipients</p>
          </div>
          <p className="text-[28px] font-bold text-white mb-1">{profile.knownRecipients}</p>
          <p className="text-[12px] text-[var(--text-muted)]">
            Contacts you have previously sent money to. New recipients are flagged as potential
            risk signals.
          </p>
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex flex-wrap gap-1.5">
              {[
                'College Canteen', 'Amazon', 'Rohan Kumar', 'Zomato', 'Spotify',
                'Ola Cabs', 'Priya Mehta', 'Netflix', 'MedPlus',
              ].map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={14} className="text-[var(--text-muted)]" />
            <p className="label-section">Trusted Devices</p>
          </div>
          <p className="text-[28px] font-bold text-white mb-1">{profile.trustedDevices}</p>
          <p className="text-[12px] text-[var(--text-muted)] mb-3">
            Devices associated with your account. Transactions from unrecognized devices are
            flagged as high-risk signals.
          </p>
          <div className="space-y-2">
            {[
              { id: 'dev_iphone_01', name: 'iPhone 14 Pro', trustLevel: 'Full Trust', lastUsed: 'Today' },
              { id: 'dev_macbook_02', name: 'MacBook Pro', trustLevel: 'Full Trust', lastUsed: '3 days ago' },
            ].map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <Smartphone size={12} className="text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">{d.name}</p>
                    <p className="font-mono text-[9px] text-[var(--text-muted)]">{d.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400">{d.trustLevel}</p>
                  <p className="text-[var(--text-muted)] text-[10px]">{d.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-[var(--text-muted)]" />
          <p className="label-section">Typical Locations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.commonLocations.map((loc) => (
            <span
              key={loc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[12px] text-white"
            >
              <MapPin size={10} className="text-red-400" />
              {loc}
            </span>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="label-section mb-1">Transaction Amount Distribution</p>
          <p className="text-[11px] text-[var(--text-muted)] mb-3">
            Most of your payments fall in the ₹200–₹500 range
          </p>
          <AmountDistribution data={MOCK_AMOUNT_DISTRIBUTION} />
        </div>

        <div className="card p-5">
          <p className="label-section mb-1">Transaction Frequency by Hour</p>
          <p className="text-[11px] text-[var(--text-muted)] mb-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-sm inline-block" /> Peak activity hours
            </span>
          </p>
          <HourlyChart data={MOCK_HOURLY_DATA} peakHours={profile.peakHours} />
        </div>
      </div>
    </div>
  );
}
