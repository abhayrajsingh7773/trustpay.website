'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpDown, MapPin, Cpu } from 'lucide-react';
import { getTransactions } from '@/lib/api';
import type { Transaction, RiskLevel } from '@/lib/types';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import RiskBadge from '@/components/ui/RiskBadge';

type FilterOption = 'ALL' | RiskLevel;

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('ALL');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const filtered = transactions
    .filter((t) => {
      const matchFilter = filter === 'ALL' || t.riskLevel === filter;
      const matchSearch =
        !search ||
        t.recipient.toLowerCase().includes(search.toLowerCase()) ||
        (t.recipientName || '').toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDir === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const FILTERS: { label: string; value: FilterOption }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Low Risk', value: 'LOW' },
    { label: 'Medium Risk', value: 'MEDIUM' },
    { label: 'High Risk', value: 'HIGH' },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <p className="label-section mb-1">History</p>
        <h1 className="text-[22px] font-bold text-white">Transactions</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} · Click any row for full analysis
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            className="input-field pl-8 text-[13px]"
            placeholder="Search recipient, UPI ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="tx-search"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded text-[11px] font-medium transition-colors border ${
                filter === f.value
                  ? f.value === 'HIGH'
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : f.value === 'MEDIUM'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : f.value === 'LOW'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-[var(--border-light)] bg-[var(--surface-2)] text-white'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:border-[var(--border-light)]'
              }`}
              id={`filter-${f.value.toLowerCase()}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="btn-ghost text-[12px] flex-shrink-0"
          id="sort-btn"
        >
          <ArrowUpDown size={13} />
          {sortDir === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)] text-[13px]">
            No transactions match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                {filtered.map((txn) => (
                  <tr key={txn.id} onClick={() => router.push(`/transactions/${txn.id}`)}>
                    <td className="font-mono text-[10px] text-[var(--text-muted)]">{txn.id}</td>
                    <td className="font-mono text-[11px] text-[var(--text-muted)] whitespace-nowrap">
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
                        <MapPin size={10} />
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
