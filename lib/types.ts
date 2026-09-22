// ─── Core Domain Types ─────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskReason {
  type: string;
  severity: RiskLevel;
  title: string;
  description: string;
  technicalDetail?: string;
  contribution: number; // 0–100 score contribution
}

export interface TransactionLocation {
  city: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  recipient: string;
  recipientName?: string;
  timestamp: string;
  location: TransactionLocation;
  deviceId: string;
  deviceName: string;
  isNewDevice: boolean;
  isNewRecipient: boolean;
  message?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: RiskReason[];
  status: 'completed' | 'pending' | 'blocked' | 'analyzing';
  category?: string;
}

export interface BehaviorProfile {
  userId: string;
  averageAmount: number;
  medianAmount: number;
  typicalRange: {
    min: number;
    max: number;
  };
  knownRecipients: number;
  trustedDevices: number;
  averageDailyTransactions: number;
  commonLocations: string[];
  peakHours: number[];
  totalTransactions: number;
  profileUpdatedAt: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'user' | 'merchant' | 'suspicious';
  x: number;
  y: number;
  riskLevel: RiskLevel;
  transactionCount: number;
  totalAmount: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  suspicious: boolean;
  timestamp: string;
}

export interface NetworkAnalysis {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  riskLevel: RiskLevel;
  connectedAccounts: number;
  transactionsAnalyzed: number;
  suspiciousConnections: number;
  patternDescription: string;
  clusterDescription: string;
}

export interface SystemStatus {
  riskEngine: 'operational' | 'degraded' | 'offline';
  behaviorModel: 'operational' | 'degraded' | 'offline';
  database: 'connected' | 'disconnected';
  api: 'operational' | 'degraded' | 'offline';
  modelVersion: string;
  lastUpdated: string;
}

// ─── API Request / Response Types ──────────────────────────────────────────

export interface AnalyzeTransactionRequest {
  recipient: string;
  amount: number;
  message?: string;
  location?: string;
  deviceId?: string;
  isNewDevice?: boolean;
  isNewRecipient?: boolean;
  qrData?: string;
}

export interface AnalyzeTransactionResponse {
  transaction: Transaction;
  behaviorComparison: BehaviorComparison;
}

export interface BehaviorComparison {
  amountVsAverage: number;        // multiplier, e.g. 18.5x
  amountVsRange: 'within' | 'above' | 'below';
  recipientStatus: 'known' | 'new';
  deviceStatus: 'trusted' | 'new';
  locationStatus: 'usual' | 'unusual';
  frequencyStatus: 'normal' | 'elevated' | 'high';
  currentDailyCount: number;
}

export interface MessageAnalysisResult {
  hasUrgencyLanguage: boolean;
  hasVerificationLanguage: boolean;
  hasMoneyRequestLanguage: boolean;
  hasThreatLanguage: boolean;
  flaggedPhrases: string[];
  riskContribution: RiskLevel;
  explanation: string;
}

export interface QRAnalysisResult {
  recipient: string;
  recipientName?: string;
  amount?: number;
  message?: string;
  previousPayments: number;
  recipientStatus: 'known' | 'new';
  riskSignal: RiskLevel;
  rawData: string;
}

// ─── Chart Data Types ───────────────────────────────────────────────────────

export interface DailyRiskDataPoint {
  day: string;
  riskScore: number;
  transactions: number;
  amount: number;
}

export interface AmountDataPoint {
  range: string;
  count: number;
}

export interface HourlyDataPoint {
  hour: string;
  count: number;
}

// ─── Demo Types ─────────────────────────────────────────────────────────────

export type DemoScenario = 'normal' | 'suspicious' | 'coordinated';

export interface DemoScenarioConfig {
  id: DemoScenario;
  label: string;
  description: string;
  recipient: string;
  amount: number;
  message: string;
  location: string;
  expectedRisk: RiskLevel;
  expectedScore: number;
}

// ─── Feedback Types ─────────────────────────────────────────────────────────

export type FeedbackCategory =
  | 'bug'
  | 'feature'
  | 'accuracy'
  | 'ui'
  | 'security'
  | 'general';

export type FeedbackStatus =
  | 'submitted'
  | 'under_review'
  | 'investigating'
  | 'planned'
  | 'resolved';

export interface SatisfactionScores {
  riskAccuracy: number;
  performance: number;
  clarity: number;
}

export interface FeedbackSubmission {
  id: string;
  category: FeedbackCategory;
  rating: number; // 1 to 5
  subject: string;
  description: string;
  satisfactionScores: SatisfactionScores;
  email?: string;
  allowFollowUp: boolean;
  attachmentName?: string;
  status: FeedbackStatus;
  createdAt: string;
  aiSentiment: 'positive' | 'neutral' | 'constructive' | 'urgent';
  officialResponse?: string;
}

export interface SubmitFeedbackRequest {
  category: FeedbackCategory;
  rating: number;
  subject: string;
  description: string;
  satisfactionScores: SatisfactionScores;
  email?: string;
  allowFollowUp: boolean;
  attachmentName?: string;
}

