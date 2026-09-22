import Link from 'next/link';
import { Shield, ArrowRight, TrendingUp, Eye, Network, AlertTriangle, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-16 lg:px-16 lg:pt-28 lg:pb-20 border-b border-[var(--border)]">
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-red-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4" />
        </div>

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-500/10 border border-red-500/30 rounded flex items-center justify-center">
              <Shield size={16} className="text-red-400" />
            </div>
            <span className="label-section text-red-400/70">Fintech Security Prototype</span>
          </div>

          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-white mb-4">
            TRUST<span className="text-red-500">PAY</span>
          </h1>

          <p className="text-[1.5rem] lg:text-[1.75rem] font-light text-[var(--text-muted)] mb-3 leading-snug">
            "Can You Trust This Payment?"
          </p>

          <p className="text-[1rem] text-[var(--text-muted)] max-w-xl leading-relaxed mb-10">
            Real-time payment risk analysis that learns your normal behavior, detects unusual
            transactions, and explains the risk before you pay.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/payment"
              className="btn-primary text-[15px] px-6 py-3"
              id="cta-analyze-payment"
            >
              Analyze a Payment
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary text-[15px] px-6 py-3"
              id="cta-view-demo"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="px-8 py-12 lg:px-16 border-b border-[var(--border)]">
        <p className="label-section mb-6">How It Works</p>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {[
            'TRANSACTION + CONTEXT',
            'USER BEHAVIOR BASELINE',
            'RISK MODEL',
            'EXPLANATION ENGINE',
            'USER ACTION',
          ].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2 lg:gap-3">
              <div className="card px-3 py-2 lg:px-4">
                <span className="font-mono text-[11px] lg:text-[12px] text-white font-medium">
                  {step}
                </span>
              </div>
              {i < arr.length - 1 && (
                <ChevronRight size={14} className="text-red-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-8 py-12 lg:px-16 border-b border-[var(--border)]">
        <p className="label-section mb-6">Core Capabilities</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 hover:border-[var(--border-light)] transition-colors group">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded flex items-center justify-center mb-4">
              <TrendingUp size={18} className="text-blue-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">Behavioral Intelligence</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              Learn what is normal for each user instead of relying only on fixed thresholds.
              The system adapts to individual payment patterns.
            </p>
          </div>

          <div className="card p-6 hover:border-[var(--border-light)] transition-colors group">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded flex items-center justify-center mb-4">
              <Eye size={18} className="text-amber-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">Explainable Risk</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              See exactly which transaction signals contributed to the risk assessment. No
              black-box decisions — full transparency on every flag.
            </p>
          </div>

          <div className="card p-6 hover:border-[var(--border-light)] transition-colors group">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded flex items-center justify-center mb-4">
              <Network size={18} className="text-red-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">Network Detection</h3>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              Identify unusual patterns across connected accounts. Detect hub-and-spoke
              aggregation and coordinated fund movement anomalies.
            </p>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="px-8 py-12 lg:px-16 border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-red-500/15 rounded-md bg-red-500/5">
          <div>
            <h2 className="text-[18px] font-bold text-white mb-1">Try the Suspicious Payment Demo</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Enter ₹48,000 to a new recipient with an urgent KYC message and see the full risk
              analysis pipeline in action.
            </p>
          </div>
          <Link href="/payment" className="btn-primary flex-shrink-0" id="cta-try-demo">
            Start Demo
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-8 py-8 lg:px-16">
        <div className="flex items-start gap-3 max-w-2xl">
          <AlertTriangle size={14} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            <strong className="text-[var(--text-muted)]">Prototype for demonstration purposes.</strong>{' '}
            Risk scores are based on transaction context and behavioral signals. TrustPay does not
            guarantee that a transaction is fraudulent or safe. Always independently verify
            suspicious payment requests.
          </p>
        </div>
      </section>
    </div>
  );
}
