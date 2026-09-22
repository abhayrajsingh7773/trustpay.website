import type {
  AnalyzeTransactionRequest,
  Transaction,
  BehaviorComparison,
  RiskReason,
  RiskLevel,
} from './types';
import { MOCK_BEHAVIOR_PROFILE, MOCK_TRANSACTIONS } from './mock-data';
import { analyzeMessage } from './message-analyzer';

// ─── Constants ────────────────────────────────────────────────────────────────

const AMOUNT_MULTIPLIER_HIGH = 10;    // 10x+ average → HIGH
const AMOUNT_MULTIPLIER_MEDIUM = 3;   // 3x+ average → MEDIUM
const AMOUNT_RANGE_UPPER = 1500;      // ₹1,500 = top of typical range
const KNOWN_RECIPIENTS = [
  'canteen@upi', 'amazon.pay@upi', 'rohan.k@okicici', 'zomato@icici',
  'spotify.india@upi', 'ola.cabs@paytm', 'priya.m@ybl', 'netflix.india@upi',
  'medplus.pharmacy@upi',
];
const TRUSTED_DEVICES = ['dev_iphone_01', 'dev_macbook_02'];
const USUAL_LOCATIONS = ['ludhiana', 'chandigarh', 'amritsar', 'punjab', 'patiala'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUsualLocation(location: string): boolean {
  const lower = location.toLowerCase();
  return USUAL_LOCATIONS.some((loc) => lower.includes(loc));
}

function isKnownRecipient(recipient: string): boolean {
  return KNOWN_RECIPIENTS.includes(recipient.toLowerCase().trim());
}

function isTrustedDevice(deviceId: string): boolean {
  return TRUSTED_DEVICES.includes(deviceId);
}

function getTodayTransactionCount(): number {
  const today = new Date().toDateString();
  return MOCK_TRANSACTIONS.filter(
    (t) => new Date(t.timestamp).toDateString() === today
  ).length;
}

// ─── Risk Engine ──────────────────────────────────────────────────────────────

/**
 * Deterministic mock risk engine.
 * Calculates a risk score 0–100 from transaction signals.
 * Replace this function when the real ML model is available.
 *
 * ⚠️ TO REPLACE: Connect analyzeTransaction() in lib/api.ts to POST /api/transactions/analyze
 */
export function calculateRisk(
  request: AnalyzeTransactionRequest
): {
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: RiskReason[];
  comparison: BehaviorComparison;
  transaction: Transaction;
} {
  const profile = MOCK_BEHAVIOR_PROFILE;
  const reasons: RiskReason[] = [];
  let scoreAccumulator = 0;

  const recipientKnown = request.isNewRecipient === false
    ? true
    : isKnownRecipient(request.recipient);

  const deviceTrusted = request.deviceId
    ? isTrustedDevice(request.deviceId)
    : request.isNewDevice !== true;

  const locationUsual = request.location
    ? isUsualLocation(request.location)
    : true;

  // ── Signal 1: Amount vs. baseline ──────────────────────────────────────────
  const amountMultiplier = request.amount / profile.averageAmount;

  if (amountMultiplier >= AMOUNT_MULTIPLIER_HIGH) {
    const contribution = Math.min(35, Math.round(amountMultiplier * 1.5));
    reasons.push({
      type: 'amount_extreme',
      severity: 'HIGH',
      title: `Amount is ${amountMultiplier.toFixed(0)}× higher than your normal transaction`,
      description: `This payment of ₹${request.amount.toLocaleString('en-IN')} is far above your average of ₹${profile.averageAmount.toLocaleString('en-IN')}.`,
      technicalDetail: `z-score: ${(amountMultiplier * 0.8).toFixed(1)} | ${Math.round(amountMultiplier * 4)}th percentile deviation`,
      contribution,
    });
    scoreAccumulator += contribution;
  } else if (amountMultiplier >= AMOUNT_MULTIPLIER_MEDIUM) {
    const contribution = Math.min(20, Math.round(amountMultiplier * 3));
    reasons.push({
      type: 'amount_elevated',
      severity: 'MEDIUM',
      title: `Amount is ${amountMultiplier.toFixed(1)}× above your average`,
      description: `₹${request.amount.toLocaleString('en-IN')} is above your typical transaction range of ₹${profile.typicalRange.min}–₹${profile.typicalRange.max.toLocaleString('en-IN')}.`,
      contribution,
    });
    scoreAccumulator += contribution;
  } else if (request.amount > AMOUNT_RANGE_UPPER) {
    reasons.push({
      type: 'amount_above_range',
      severity: 'LOW',
      title: 'Amount slightly above typical range',
      description: `₹${request.amount.toLocaleString('en-IN')} is above your usual range but not significantly unusual.`,
      contribution: 8,
    });
    scoreAccumulator += 8;
  }

  // ── Signal 2: New recipient ────────────────────────────────────────────────
  if (!recipientKnown) {
    reasons.push({
      type: 'new_recipient',
      severity: 'HIGH',
      title: 'First-time recipient',
      description: `You have never sent money to ${request.recipient} before.`,
      technicalDetail: 'Recipient not found in your payment history',
      contribution: 25,
    });
    scoreAccumulator += 25;
  }

  // ── Signal 3: New device ───────────────────────────────────────────────────
  if (!deviceTrusted) {
    reasons.push({
      type: 'new_device',
      severity: 'HIGH',
      title: 'Unrecognized device',
      description: 'This payment originated from a device that is not associated with your account.',
      technicalDetail: 'Device trust level: 0 | Not in trusted device registry',
      contribution: 20,
    });
    scoreAccumulator += 20;
  }

  // ── Signal 4: Location anomaly ─────────────────────────────────────────────
  if (!locationUsual) {
    reasons.push({
      type: 'location_anomaly',
      severity: 'MEDIUM',
      title: 'Unusual transaction location',
      description: `Transaction originated from ${request.location || 'an unrecognized location'}, which is outside your normal area.`,
      technicalDetail: 'Location significantly deviates from your usual activity zones',
      contribution: 7,
    });
    scoreAccumulator += 7;
  }

  // ── Signal 5: Message analysis ─────────────────────────────────────────────
  if (request.message && request.message.trim().length > 0) {
    const msgAnalysis = analyzeMessage(request.message);
    if (msgAnalysis.riskContribution === 'HIGH') {
      reasons.push({
        type: 'message_signal',
        severity: 'HIGH',
        title: 'High-risk language detected in message',
        description: msgAnalysis.explanation,
        technicalDetail: `Flagged: ${msgAnalysis.flaggedPhrases.join(', ')}`,
        contribution: 10,
      });
      scoreAccumulator += 10;
    } else if (msgAnalysis.riskContribution === 'MEDIUM') {
      reasons.push({
        type: 'message_signal',
        severity: 'MEDIUM',
        title: 'Urgency or verification language in message',
        description: msgAnalysis.explanation,
        technicalDetail: `Flagged: ${msgAnalysis.flaggedPhrases.join(', ')}`,
        contribution: 4,
      });
      scoreAccumulator += 4;
    }
  }

  // ── Signal 6: Transaction frequency ───────────────────────────────────────
  const todayCount = getTodayTransactionCount();
  const avgDaily = profile.averageDailyTransactions;
  if (todayCount > avgDaily * 2) {
    reasons.push({
      type: 'frequency_anomaly',
      severity: 'MEDIUM',
      title: 'Unusually high transaction frequency',
      description: `You've made ${todayCount} transactions today, significantly above your average of ${avgDaily}/day.`,
      contribution: 5,
    });
    scoreAccumulator += 5;
  }

  // ── Clamp score ────────────────────────────────────────────────────────────
  const riskScore = Math.min(100, Math.max(0, scoreAccumulator));

  let riskLevel: RiskLevel = 'LOW';
  if (riskScore >= 60) riskLevel = 'HIGH';
  else if (riskScore >= 30) riskLevel = 'MEDIUM';

  // ── Behavior comparison ────────────────────────────────────────────────────
  const comparison: BehaviorComparison = {
    amountVsAverage: parseFloat(amountMultiplier.toFixed(1)),
    amountVsRange:
      request.amount > profile.typicalRange.max
        ? 'above'
        : request.amount < profile.typicalRange.min
        ? 'below'
        : 'within',
    recipientStatus: recipientKnown ? 'known' : 'new',
    deviceStatus: deviceTrusted ? 'trusted' : 'new',
    locationStatus: locationUsual ? 'usual' : 'unusual',
    frequencyStatus:
      todayCount > avgDaily * 2
        ? 'high'
        : todayCount > avgDaily * 1.5
        ? 'elevated'
        : 'normal',
    currentDailyCount: todayCount,
  };

  // ── Synthesize transaction object ──────────────────────────────────────────
  const transaction: Transaction = {
    id: `TXN_LIVE_${Date.now()}`,
    userId: 'user_ayush_01',
    amount: request.amount,
    recipient: request.recipient,
    recipientName: recipientKnown ? 'Known Recipient' : 'Unknown Recipient',
    timestamp: new Date().toISOString(),
    location: {
      city: request.location?.split(',')[0] || 'Unknown',
      state: request.location?.split(',')[1]?.trim() || '',
    },
    deviceId: request.deviceId || (deviceTrusted ? 'dev_iphone_01' : 'dev_unknown_new'),
    deviceName: deviceTrusted ? 'iPhone 14 Pro' : 'Unknown Device',
    isNewDevice: !deviceTrusted,
    isNewRecipient: !recipientKnown,
    message: request.message,
    riskScore,
    riskLevel,
    reasons,
    status: riskScore >= 60 ? 'blocked' : 'completed',
    category: 'Unknown',
  };

  return { riskScore, riskLevel, reasons, comparison, transaction };
}
