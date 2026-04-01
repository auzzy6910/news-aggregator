export type Platform = 'twitter' | 'tiktok' | 'instagram' | 'facebook' | 'reddit' | 'web';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  aiDraft: string;
  platform: Platform;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  originalUrl: string;
  author: string;
  publishedAt: string;
  location: {
    country: string;
    region: string;
  };
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    velocity: number; // rate of engagement change per hour
  };
  trendScore: number; // 0-100
  hashtags: string[];
  isAutoPostEnabled: boolean;
  status: 'draft' | 'scheduled' | 'posted' | 'trending';
}

export interface TrendData {
  time: string;
  twitter: number;
  tiktok: number;
  instagram: number;
  facebook: number;
  reddit: number;
}

export interface LocationNode {
  name: string;
  code: string;
  type: 'country' | 'state' | 'county';
  children?: LocationNode[];
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  avatar: string;
  connected: boolean;
  followers: number;
}

export interface AutoPostRule {
  id: string;
  platform: Platform;
  threshold: number;
  enabled: boolean;
  accounts: string[];
}

export interface PredictionItem {
  id: string;
  topic: string;
  currentScore: number;
  predictedPeak: number;
  timeToTrend: string;
  velocity: number;
  platforms: Platform[];
  confidence: number;
  dataPoints: { time: string; score: number }[];
}
