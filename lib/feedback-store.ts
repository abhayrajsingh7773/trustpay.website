import type { FeedbackSubmission, SubmitFeedbackRequest } from './types';

const STORAGE_KEY = 'trustpay_feedback_submissions';

export const INITIAL_FEEDBACK_ITEMS: FeedbackSubmission[] = [
  {
    id: 'FB-9842',
    category: 'accuracy',
    rating: 5,
    subject: 'Risk score correctly identified suspicious location anomaly',
    description:
      'The risk engine flagged a payment attempt during travel to Jaipur when using a new public Wi-Fi network. The step-up verification worked seamlessly.',
    satisfactionScores: {
      riskAccuracy: 100,
      performance: 95,
      clarity: 90,
    },
    email: 'ayush.sharma@okaxis',
    allowFollowUp: true,
    status: 'resolved',
    createdAt: '2026-09-18T14:32:00.000Z',
    aiSentiment: 'positive',
    officialResponse:
      'Thank you for your feedback! Our geo-velocity and network fingerprinting algorithms continuously calibrate based on user feedback.',
  },
  {
    id: 'FB-9710',
    category: 'feature',
    rating: 4,
    subject: 'Request for custom UPI ID whitelist per contact group',
    description:
      'It would be helpful to group trusted UPI contacts (e.g. Family, College Canteen, recurring vendors) into custom risk auto-approve lists.',
    satisfactionScores: {
      riskAccuracy: 85,
      performance: 90,
      clarity: 85,
    },
    email: 'ayush.sharma@okaxis',
    allowFollowUp: true,
    status: 'planned',
    createdAt: '2026-09-14T09:15:00.000Z',
    aiSentiment: 'constructive',
    officialResponse:
      'Great suggestion! Custom whitelist tagging is currently on our product roadmap for Q4.',
  },
  {
    id: 'FB-9541',
    category: 'ui',
    rating: 5,
    subject: 'Dark mode contrast on Risk Analysis page is excellent',
    description:
      'The real-time graph visualization and breakdown of risk contribution percentages make it very easy to understand why a transaction was flagged.',
    satisfactionScores: {
      riskAccuracy: 95,
      performance: 100,
      clarity: 100,
    },
    email: '',
    allowFollowUp: false,
    status: 'resolved',
    createdAt: '2026-09-10T18:45:00.000Z',
    aiSentiment: 'positive',
  },
];

export function getStoredFeedback(): FeedbackSubmission[] {
  if (typeof window === 'undefined') return INITIAL_FEEDBACK_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FEEDBACK_ITEMS));
      return INITIAL_FEEDBACK_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load feedback from localStorage', e);
    return INITIAL_FEEDBACK_ITEMS;
  }
}

export function saveFeedbackSubmission(request: SubmitFeedbackRequest): FeedbackSubmission {
  const existing = getStoredFeedback();
  
  // Determine AI sentiment heuristic based on rating & keywords
  let aiSentiment: FeedbackSubmission['aiSentiment'] = 'neutral';
  const descLower = request.description.toLowerCase();
  if (request.category === 'security' || descLower.includes('urgent') || descLower.includes('stolen') || descLower.includes('hack')) {
    aiSentiment = 'urgent';
  } else if (request.rating >= 4) {
    aiSentiment = 'positive';
  } else {
    aiSentiment = 'constructive';
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newSubmission: FeedbackSubmission = {
    id: `FB-${randomNum}`,
    category: request.category,
    rating: request.rating,
    subject: request.subject,
    description: request.description,
    satisfactionScores: request.satisfactionScores,
    email: request.email,
    allowFollowUp: request.allowFollowUp,
    attachmentName: request.attachmentName,
    status: 'under_review',
    createdAt: new Date().toISOString(),
    aiSentiment,
    officialResponse: 'Thank you! Our risk intelligence team has received your submission and is reviewing it.',
  };

  const updated = [newSubmission, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save feedback to localStorage', e);
    }
  }

  return newSubmission;
}
