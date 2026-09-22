'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  MapPin,
  Smartphone,
  QrCode,
  Upload,
  Lock,
  AlertTriangle,
  X,
} from 'lucide-react';
import LoadingSteps from '@/components/ui/LoadingSteps';
import DemoSelector from '@/components/demo/DemoSelector';
import { analyzeTransaction, analyzeQR } from '@/lib/api';
import type { DemoScenario } from '@/lib/types';
import { DEMO_SCENARIOS } from '@/lib/mock-data';
import type { QRAnalysisResult } from '@/lib/types';

const ANALYSIS_STEPS = [
  'Analyzing transaction context...',
  'Comparing with your normal behavior...',
  'Checking recipient history...',
  'Evaluating device and location...',
  'Generating risk explanation...',
];

export default function PaymentPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    recipient: '',
    amount: '',
    message: '',
    location: 'Ludhiana, Punjab',
    deviceId: 'dev_iphone_01',
    isNewDevice: false,
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [qrResult, setQrResult] = useState<QRAnalysisResult | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const handleDemoSelect = (scenario: DemoScenario) => {
    if (scenario === 'coordinated') {
      router.push('/network');
      return;
    }
    const s = DEMO_SCENARIOS.find((d) => d.id === scenario)!;
    setForm({
      recipient: s.recipient,
      amount: String(s.amount),
      message: s.message,
      location: s.location,
      deviceId: scenario === 'suspicious' ? 'dev_unknown_new' : 'dev_iphone_01',
      isNewDevice: scenario === 'suspicious',
    });
    setQrResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipient || !form.amount) {
      setError('Recipient and amount are required.');
      return;
    }
    setError('');
    setLoading(true);
    setCurrentStep(0);

    // Step through loading states
    for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 520));
      setCurrentStep(i);
    }

    try {
      const result = await analyzeTransaction({
        recipient: form.recipient,
        amount: parseFloat(form.amount),
        message: form.message,
        location: form.location,
        deviceId: form.deviceId,
        isNewDevice: form.isNewDevice,
        isNewRecipient: undefined,
      });

      // Store result in sessionStorage for the analysis page
      sessionStorage.setItem('trustpay_analysis', JSON.stringify(result));
      router.push('/analysis');
    } catch {
      setError('Risk analysis service unavailable. Please try again.');
      setLoading(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string) || '';
      try {
        const result = await analyzeQR(base64);
        setQrResult(result);
        setForm((f) => ({
          ...f,
          recipient: result.recipient,
          amount: result.amount ? String(result.amount) : f.amount,
          message: result.message || f.message,
        }));
      } finally {
        setQrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const DEVICE_OPTIONS = [
    { id: 'dev_iphone_01', label: 'iPhone 14 Pro (trusted)' },
    { id: 'dev_macbook_02', label: 'MacBook Pro (trusted)' },
    { id: 'dev_unknown_new', label: 'Unknown Device (new)', isNew: true },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-2xl animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <p className="label-section mb-1">Payment Analysis</p>
        <h1 className="text-[22px] font-bold text-white">Analyze a Payment</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
          Check the transaction context before sending money.
        </p>
      </div>

      {/* Demo Selector */}
      <DemoSelector onSelect={handleDemoSelect} />

      {/* Loading State */}
      {loading && (
        <div className="mt-5 card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-[13px] font-medium text-white">Running Risk Analysis</span>
          </div>
          <LoadingSteps steps={ANALYSIS_STEPS} currentStep={currentStep} />
          <div className="mt-4 bg-[var(--surface-2)] rounded h-1 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form */}
      {!loading && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="demo-banner">
              <AlertTriangle size={13} className="flex-shrink-0" />
              {error}
              <button type="button" onClick={() => setError('')} className="ml-auto">
                <X size={13} />
              </button>
            </div>
          )}

          {/* QR Upload */}
          <div>
            <label className="label-section block mb-2">Upload QR Code (Optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleQrUpload}
              id="qr-file-input"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={qrLoading}
              className="btn-secondary w-full justify-center py-3 border-dashed"
              id="qr-upload-btn"
            >
              {qrLoading ? (
                <>
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </>
              ) : (
                <>
                  <QrCode size={15} />
                  {qrResult ? `QR: ${qrResult.recipient}` : 'Upload QR Image'}
                </>
              )}
            </button>

            {/* QR Result */}
            {qrResult && (
              <div className="mt-2 p-3 border border-[var(--border-light)] rounded bg-[var(--surface-2)] text-[12px]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[var(--text-muted)]">QR Recipient</p>
                    <p className="font-mono text-white">{qrResult.recipient}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">Previous Payments</p>
                    <p className="text-white">{qrResult.previousPayments}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">Recipient Status</p>
                    <p className={qrResult.recipientStatus === 'known' ? 'text-emerald-400' : 'text-amber-400'}>
                      {qrResult.recipientStatus === 'known' ? 'Known' : 'NEW'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">Risk Signal</p>
                    <p className={qrResult.riskSignal === 'LOW' ? 'text-emerald-400' : qrResult.riskSignal === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'}>
                      {qrResult.riskSignal}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recipient */}
          <div>
            <label className="label-section block mb-2" htmlFor="recipient">
              Recipient / UPI ID
            </label>
            <input
              id="recipient"
              type="text"
              className="input-field"
              placeholder="rahulent@upi"
              value={form.recipient}
              onChange={(e) => setForm((f) => ({ ...f, recipient: e.target.value }))}
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="label-section block mb-2" htmlFor="amount">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              className="input-field font-mono"
              placeholder="48000"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              min={1}
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="label-section block mb-2" htmlFor="message">
              Message / Payment Request
            </label>
            <textarea
              id="message"
              className="input-field resize-none"
              placeholder="Urgent KYC verification required"
              rows={3}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div>
            <label className="label-section block mb-2" htmlFor="location">
              <MapPin size={11} className="inline mr-1" />
              Location
            </label>
            <input
              id="location"
              type="text"
              className="input-field"
              placeholder="Ludhiana, Punjab"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>

          {/* Device */}
          <div>
            <label className="label-section block mb-2">
              <Smartphone size={11} className="inline mr-1" />
              Device
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {DEVICE_OPTIONS.map((d) => (
                <label
                  key={d.id}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded border cursor-pointer transition-colors text-[13px] ${
                    form.deviceId === d.id
                      ? 'border-red-500/40 bg-red-500/5 text-white'
                      : 'border-[var(--border-light)] hover:border-[var(--border-light)] text-[var(--text-muted)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="device"
                    value={d.id}
                    checked={form.deviceId === d.id}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        deviceId: d.id,
                        isNewDevice: d.id === 'dev_unknown_new',
                      }))
                    }
                    className="accent-red-500"
                  />
                  <Smartphone size={13} />
                  {d.label}
                  {d.isNew && (
                    <span className="ml-auto text-[10px] text-red-400 border border-red-500/20 bg-red-500/10 px-1.5 rounded">
                      NEW
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 rounded bg-[var(--surface-2)] border border-[var(--border)]">
            <Lock size={12} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Risk scores are based on transaction context and behavioral signals. TrustPay does
              not guarantee any transaction is fraudulent or safe. This data stays local.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center py-3 text-[14px] tracking-wide"
            id="analyze-payment-btn"
          >
            <Send size={15} />
            ANALYZE PAYMENT
          </button>
        </form>
      )}
    </div>
  );
}
