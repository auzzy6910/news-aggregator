export type Platform = 'twitter' | 'tiktok' | 'instagram' | 'facebook' | 'reddit' | 'web';

export type Sentiment = 'positive' | 'negative' | 'neutral';

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
    velocity: number;
  };
  trendScore: number;
  hashtags: string[];
  isAutoPostEnabled: boolean;
  status: 'draft' | 'scheduled' | 'posted' | 'trending';
  sentiment: Sentiment;
  sentimentScore: number;
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

export interface Notification {
  id: string;
  type: 'trend_alert' | 'auto_post' | 'velocity_spike' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  platform?: Platform;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  platform: Platform;
  status: 'scheduled' | 'posted' | 'draft';
  newsId?: string;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  platform: Platform;
  likes: number;
  sentiment: Sentiment;
  newsId: string;
}

export interface HashtagMetric {
  tag: string;
  impressions: number;
  engagement: number;
  posts: number;
  growth: number;
  platforms: Platform[];
  trend: number[];
}
