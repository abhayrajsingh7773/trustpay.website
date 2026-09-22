/**
 * ─── TrustPay API Service Layer ──────────────────────────────────────────────
 *
 * All API calls are centralized here. The frontend never calls mock logic directly.
 *
 * To connect the real FastAPI backend:
 *   1. Set NEXT_PUBLIC_API_URL in your .env.local
 *   2. Each function will automatically prefer the real backend over mock data.
 *   3. Replace the mock fallback sections with the actual response parsing logic.
 *
 * Future FastAPI endpoints:
 *   POST /api/transactions/analyze
 *   GET  /api/transactions
 *   GET  /api/transactions/{id}
 *   GET  /api/profile/behavior
 *   POST /api/message/analyze
 *   POST /api/qr/analyze
 *   GET  /api/network
 */

import type {
  AnalyzeTransactionRequest,
  AnalyzeTransactionResponse,
  Transaction,
  BehaviorProfile,
  NetworkAnalysis,
  SystemStatus,
  MessageAnalysisResult,
  QRAnalysisResult,
  FeedbackSubmission,
  SubmitFeedbackRequest,
} from './types';
import { getStoredFeedback, saveFeedbackSubmission } from './feedback-store';

import {
  MOCK_TRANSACTIONS,
  MOCK_BEHAVIOR_PROFILE,
  MOCK_NETWORK_ANALYSIS,
  MOCK_SYSTEM_STATUS,
} from './mock-data';

import { calculateRisk } from './risk-engine';
import { analyzeMessage as analyzeMessageLocal } from './message-analyzer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function tryFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Simulate async delay for mock ───────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Analyze a payment transaction.
 * REPLACE: When backend is ready, remove mock fallback.
 */
export async function analyzeTransaction(
  request: AnalyzeTransactionRequest
): Promise<AnalyzeTransactionResponse> {
  // Try real backend first
  const real = await tryFetch<AnalyzeTransactionResponse>('/api/transactions/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  if (real) return real;

  // Mock fallback — simulated processing delay
  await delay(2800);
  const result = calculateRisk(request);
  return {
    transaction: result.transaction,
    behaviorComparison: result.comparison,
  };
}

/**
 * Get all transactions for the current user.
 * REPLACE: Connect to GET /api/transactions
 */
export async function getTransactions(): Promise<Transaction[]> {
  const real = await tryFetch<Transaction[]>('/api/transactions');
  if (real) return real;

  await delay(300);
  return MOCK_TRANSACTIONS;
}

/**
 * Get a specific transaction by ID.
 * REPLACE: Connect to GET /api/transactions/{id}
 */
export async function getTransaction(id: string): Promise<Transaction | null> {
  const real = await tryFetch<Transaction>(`/api/transactions/${id}`);
  if (real) return real;

  await delay(200);
  return MOCK_TRANSACTIONS.find((t) => t.id === id) || null;
}

/**
 * Get the behavior profile for the current user.
 * REPLACE: Connect to GET /api/profile/behavior
 */
export async function getBehaviorProfile(): Promise<BehaviorProfile> {
  const real = await tryFetch<BehaviorProfile>('/api/profile/behavior');
  if (real) return real;

  await delay(300);
  return MOCK_BEHAVIOR_PROFILE;
}

/**
 * Get network analysis data.
 * REPLACE: Connect to GET /api/network
 */
export async function getNetworkAnalysis(): Promise<NetworkAnalysis> {
  const real = await tryFetch<NetworkAnalysis>('/api/network');
  if (real) return real;

  await delay(400);
  return MOCK_NETWORK_ANALYSIS;
}

/**
 * Analyze a payment message for risk signals.
 * REPLACE: Connect to POST /api/message/analyze
 */
export async function analyzeMessageAPI(message: string): Promise<MessageAnalysisResult> {
  const real = await tryFetch<MessageAnalysisResult>('/api/message/analyze', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  if (real) return real;

  await delay(200);
  return analyzeMessageLocal(message);
}

/**
 * Analyze a QR code image for payment information.
 * REPLACE: Connect to POST /api/qr/analyze (send base64 image)
 */
export async function analyzeQR(imageData: string): Promise<QRAnalysisResult> {
  const real = await tryFetch<QRAnalysisResult>('/api/qr/analyze', {
    method: 'POST',
    body: JSON.stringify({ image: imageData }),
  });
  if (real) return real;

  // Mock QR analysis — in a real implementation, jsqr would decode the image
  await delay(800);

  // Check if it's the known canteen QR (mock scenario)
  const isKnown = imageData.length % 3 === 0; // simple deterministic split for demo

  return {
    recipient: isKnown ? 'canteen@upi' : 'randommerchant@upi',
    recipientName: isKnown ? 'College Canteen' : 'Unknown Merchant',
    amount: isKnown ? 250 : undefined,
    message: isKnown ? 'Lunch' : undefined,
    previousPayments: isKnown ? 14 : 0,
    recipientStatus: isKnown ? 'known' : 'new',
    riskSignal: isKnown ? 'LOW' : 'MEDIUM',
    rawData: `upi://pay?pa=${isKnown ? 'canteen@upi' : 'randommerchant@upi'}&am=${isKnown ? '250' : ''}`,
  };
}

/**
 * Get system operational status.
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  const real = await tryFetch<SystemStatus>('/api/status');
  if (real) return real;

  await delay(100);
  return MOCK_SYSTEM_STATUS;
}

/**
 * Submit app feedback or bug report.
 * REPLACE: Connect to POST /api/feedback
 */
export async function submitFeedback(
  request: SubmitFeedbackRequest
): Promise<FeedbackSubmission> {
  const real = await tryFetch<FeedbackSubmission>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  if (real) return real;

  await delay(800);
  return saveFeedbackSubmission(request);
}

/**
 * Get feedback history for current user.
 * REPLACE: Connect to GET /api/feedback
 */
export async function getFeedbackHistory(): Promise<FeedbackSubmission[]> {
  const real = await tryFetch<FeedbackSubmission[]>('/api/feedback');
  if (real) return real;

  await delay(300);
  return getStoredFeedback();
}

