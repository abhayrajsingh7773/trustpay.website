'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Network, Info } from 'lucide-react';
import { getNetworkAnalysis } from '@/lib/api';
import type { NetworkAnalysis } from '@/lib/types';
import NetworkGraph from '@/components/network/NetworkGraph';
import RiskBadge from '@/components/ui/RiskBadge';
import StatCard from '@/components/ui/StatCard';

export default function NetworkPage() {
  const [data, setData] = useState<NetworkAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNetworkAnalysis().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="label-section mb-1">Graph Analysis</p>
          <h1 className="text-[22px] font-bold text-white">Coordinated Fraud Pattern Detection</h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
            Analyze relationships between accounts and transactions.
          </p>
        </div>
        {data && <RiskBadge level={data.riskLevel} />}
      </div>

      {/* Stats Row */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Network Risk" value={data.riskLevel} accent />
          <StatCard label="Connected Accounts" value={data.connectedAccounts} />
          <StatCard label="Transactions Analyzed" value={data.transactionsAnalyzed} />
          <StatCard label="Suspicious Connections" value={data.suspiciousConnections} accent />
        </div>
      )}

      {/* Pattern Description */}
      {data && (
        <div className="card p-4 border-amber-500/15 bg-amber-500/5">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-amber-400 mb-1">Network Anomaly Detected</p>
              <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                {data.patternDescription}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                <strong className="text-white">Pattern: </strong>
                {data.clusterDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Graph */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="label-section">Account Relationship Graph</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Hover nodes for details · Red arrows = suspicious flows
            </p>
          </div>
          <Network size={16} className="text-[var(--text-muted)]" />
        </div>

        {loading ? (
          <div className="h-[420px] flex items-center justify-center">
            <div className="flex gap-1">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        ) : data ? (
          <NetworkGraph nodes={data.nodes} edges={data.edges} />
        ) : null}
      </div>

      {/* Account Table */}
      {data && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)]">
            <p className="label-section">Involved Accounts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Transactions</th>
                  <th>Total Amount</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((node) => (
                  <tr key={node.id}>
                    <td className="font-semibold text-white">{node.label}</td>
                    <td>
                      <span
                        className={`text-[11px] capitalize font-medium ${
                          node.type === 'suspicious' ? 'text-red-400' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {node.type}
                      </span>
                    </td>
                    <td className="font-mono text-[12px]">{node.transactionCount}</td>
                    <td className="font-mono text-[12px]">
                      ₹{node.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <RiskBadge level={node.riskLevel} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2">
        <Info size={12} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Network patterns are identified as anomalies or risk indicators, not definitive proof of
          coordinated fraud. Always conduct further investigation before taking enforcement action.
          This prototype uses Isolation Forest + NetworkX graph analysis concepts for demonstration.
        </p>
      </div>
    </div>
  );
}
