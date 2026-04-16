import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  NewsItem,
  TrendData,
  LocationNode,
  SocialAccount,
  AutoPostRule,
  PredictionItem,
  Platform,
} from '../types';
import {
  mockNews,
  trendTimelineData,
  locationTree,
  socialAccounts as mockSocialAccounts,
  autoPostRules as mockAutoPostRules,
  predictions as mockPredictions,
  platformColors,
  categoryColors,
} from '../data/mockData';

export type SortMode = 'hot' | 'new' | 'rising';

interface DataContextType {
  // News
  news: NewsItem[];
  filteredNews: NewsItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activePlatform: Platform | 'all';
  setActivePlatform: (p: Platform | 'all') => void;
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;
  updateNewsStatus: (id: string, status: NewsItem['status']) => void;
  toggleAutoPost: (id: string) => void;

  // Trends
  trendTimeline: TrendData[];

  // Locations
  locations: LocationNode[];

  // Social
  socialAccounts: SocialAccount[];
  toggleConnection: (id: string) => void;

  // Auto-Post Rules
  autoPostRules: AutoPostRule[];
  toggleRule: (id: string) => void;
  addRule: (rule: Omit<AutoPostRule, 'id'>) => void;
  updateRuleThreshold: (id: string, threshold: number) => void;

  // Predictions
  predictions: PredictionItem[];

  // Stats
  stats: {
    trendingCount: number;
    totalImpressions: number;
    autoPosted: number;
    avgVelocity: number;
  };

  // Colors
  platformColors: Record<string, string>;
  categoryColors: Record<string, string>;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'trend' | 'post' | 'velocity' | 'system';
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Trend Detected',
    message: 'SpaceX Starship topic is surging with 9.2K velocity',
    time: '2 min ago',
    read: false,
    type: 'trend',
  },
  {
    id: '2',
    title: 'Auto-Posted Successfully',
    message: 'Malaria Vaccine article was posted to X (Twitter)',
    time: '15 min ago',
    read: false,
    type: 'post',
  },
  {
    id: '3',
    title: 'Velocity Spike Alert',
    message: 'Gen Z Finance content velocity exceeded 5,000/hr',
    time: '1 hour ago',
    read: false,
    type: 'velocity',
  },
];

const DataContext = createContext<DataContextType | null>(null);

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export default function DataProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockSocialAccounts);
  const [rules, setRules] = useState<AutoPostRule[]>(mockAutoPostRules);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const filteredNews = useMemo(() => {
    let items = [...newsItems];

    // Platform filter
    if (activePlatform !== 'all') {
      items = items.filter((item) => item.platform === activePlatform);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.hashtags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortMode) {
      case 'hot':
        items.sort((a, b) => b.trendScore - a.trendScore);
        break;
      case 'new':
        items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'rising':
        items.sort((a, b) => b.metrics.velocity - a.metrics.velocity);
        break;
    }

    return items;
  }, [newsItems, searchQuery, activePlatform, sortMode]);

  const updateNewsStatus = useCallback((id: string, status: NewsItem['status']) => {
    setNewsItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }, []);

  const toggleAutoPost = useCallback((id: string) => {
    setNewsItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAutoPostEnabled: !item.isAutoPostEnabled } : item
      )
    );
  }, []);

  const toggleConnection = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a))
    );
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const addRule = useCallback((rule: Omit<AutoPostRule, 'id'>) => {
    const newRule: AutoPostRule = {
      ...rule,
      id: String(Date.now()),
    };
    setRules((prev) => [...prev, newRule]);
  }, []);

  const updateRuleThreshold = useCallback((id: string, threshold: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, threshold } : r))
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const stats = useMemo(() => {
    const trendingCount = newsItems.filter((n) => n.status === 'trending').length;
    const totalImpressions = newsItems.reduce(
      (sum, n) => sum + n.metrics.likes + n.metrics.shares + n.metrics.comments,
      0
    );
    const autoPosted = newsItems.filter(
      (n) => n.isAutoPostEnabled && n.status === 'posted'
    ).length;
    const avgVelocity =
      newsItems.length > 0
        ? Math.round(
            (newsItems.reduce((sum, n) => sum + n.metrics.velocity, 0) / newsItems.length) * 10
          ) / 10
        : 0;

    return { trendingCount, totalImpressions, autoPosted, avgVelocity };
  }, [newsItems]);

  const value: DataContextType = {
    news: newsItems,
    filteredNews,
    searchQuery,
    setSearchQuery,
    activePlatform,
    setActivePlatform,
    sortMode,
    setSortMode,
    updateNewsStatus,
    toggleAutoPost,
    trendTimeline: trendTimelineData,
    locations: locationTree,
    socialAccounts: accounts,
    toggleConnection,
    autoPostRules: rules,
    toggleRule,
    addRule,
    updateRuleThreshold,
    predictions: mockPredictions,
    stats,
    platformColors,
    categoryColors,
    notifications,
    markNotificationRead,
    clearNotifications,
    unreadCount,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
