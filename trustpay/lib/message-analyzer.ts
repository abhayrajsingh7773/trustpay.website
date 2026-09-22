import type { MessageAnalysisResult, RiskLevel } from './types';

// ─── Keyword Dictionaries ────────────────────────────────────────────────────

const URGENCY_PHRASES = [
  'urgent', 'urgently', 'immediately', 'asap', 'right now', 'hurry',
  'last chance', 'limited time', 'act now', 'do not delay', 'deadline',
];

const VERIFICATION_PHRASES = [
  'kyc', 'know your customer', 'verify', 'verification', 'activate',
  'reactivate', 'account suspended', 'account blocked', 'account expired',
  'confirm your', 'update your', 'validate',
];

const MONEY_REQUEST_PHRASES = [
  'send money', 'transfer', 'pay now', 'payment required', 'fee',
  'processing fee', 'token amount', 'refundable', 'advance payment',
];

const THREAT_PHRASES = [
  'account will be closed', 'account will be blocked', 'legal action',
  'penalty', 'fine', 'suspended', 'terminated', 'deactivated', 'banned',
];

// ─── Analyzer ────────────────────────────────────────────────────────────────

function containsAny(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((phrase) => lower.includes(phrase));
}

export function analyzeMessage(message: string): MessageAnalysisResult {
  if (!message || message.trim().length === 0) {
    return {
      hasUrgencyLanguage: false,
      hasVerificationLanguage: false,
      hasMoneyRequestLanguage: false,
      hasThreatLanguage: false,
      flaggedPhrases: [],
      riskContribution: 'LOW',
      explanation: 'No message provided.',
    };
  }

  const urgencyMatches = containsAny(message, URGENCY_PHRASES);
  const verificationMatches = containsAny(message, VERIFICATION_PHRASES);
  const moneyMatches = containsAny(message, MONEY_REQUEST_PHRASES);
  const threatMatches = containsAny(message, THREAT_PHRASES);

  const allFlagged = [
    ...urgencyMatches,
    ...verificationMatches,
    ...moneyMatches,
    ...threatMatches,
  ];

  const hasUrgency = urgencyMatches.length > 0;
  const hasVerification = verificationMatches.length > 0;
  const hasMoney = moneyMatches.length > 0;
  const hasThreat = threatMatches.length > 0;

  // Determine risk contribution
  const signalCount =
    (hasUrgency ? 1 : 0) +
    (hasVerification ? 1 : 0) +
    (hasMoney ? 1 : 0) +
    (hasThreat ? 1 : 0);

  let riskContribution: RiskLevel = 'LOW';
  if (signalCount >= 3 || (hasUrgency && hasVerification)) {
    riskContribution = 'HIGH';
  } else if (signalCount >= 2) {
    riskContribution = 'MEDIUM';
  } else if (signalCount >= 1) {
    riskContribution = 'LOW';
  }

  // Build explanation
  const parts: string[] = [];
  if (hasUrgency) parts.push('urgency language');
  if (hasVerification) parts.push('account-verification language');
  if (hasMoney) parts.push('money-request language');
  if (hasThreat) parts.push('threat language');

  const explanation =
    parts.length > 0
      ? `The message contains ${parts.join(', ')}. This is a contextual warning and does not by itself indicate fraud. Always independently verify the request.`
      : 'The message does not contain any notable risk signals.';

  return {
    hasUrgencyLanguage: hasUrgency,
    hasVerificationLanguage: hasVerification,
    hasMoneyRequestLanguage: hasMoney,
    hasThreatLanguage: hasThreat,
    flaggedPhrases: Array.from(new Set(allFlagged)),
    riskContribution,
    explanation,
  };
}
