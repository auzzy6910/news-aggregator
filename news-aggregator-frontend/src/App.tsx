import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import NewsCard from './components/dashboard/NewsCard';
import PredictionsPage from './components/trends/PredictionsPage';
import GeographicPage from './components/dashboard/GeographicPage';
import ContentPage from './components/content/ContentPage';
import SocialHubPage from './components/social/SocialHubPage';
import SettingsPage from './components/dashboard/SettingsPage';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import ComparisonView from './components/analytics/ComparisonView';
import ExportReports from './components/analytics/ExportReports';
import ContentCalendar from './components/content/ContentCalendar';
import PostComposer from './components/content/PostComposer';
import CommentFeed from './components/features/CommentFeed';
import HashtagTracker from './components/features/HashtagTracker';
import BookmarksPage from './components/features/BookmarksPage';
import AdvancedSearch from './components/features/AdvancedSearch';
import DragDropDashboard from './components/features/DragDropDashboard';
import InfiniteScroll from './components/features/InfiniteScroll';
import KeyboardShortcuts from './components/features/KeyboardShortcuts';
import OnboardingTour from './components/features/OnboardingTour';
import { useTheme } from './contexts/ThemeContext';
import { mockNews } from './data/mockData';
import { Platform } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('trendpulse-onboarding-done');
  });
  const { toggleTheme } = useTheme();

  const filteredNews = useMemo(() => {
    return mockNews.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlatform = activePlatform === 'all' || item.platform === activePlatform;

      return matchesSearch && matchesPlatform;
    });
  }, [searchQuery, activePlatform]);

  const handleNavigate = useCallback((tab: string) => {
    if (tab === 'shortcuts') {
      setShowShortcuts(true);
    } else if (tab === 'theme') {
      toggleTheme();
    } else {
      setActiveTab(tab);
    }
  }, [toggleTheme]);

  const handleToggleNotifications = useCallback(() => {
    // Toggle notifications panel via a custom event or direct state
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <PredictionsPage />;
      case 'geographic':
        return <GeographicPage />;
      case 'content':
        return <ContentPage />;
      case 'social':
        return <SocialHubPage />;
      case 'settings':
        return <SettingsPage />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'comparison':
        return <ComparisonView />;
      case 'export':
        return <ExportReports />;
      case 'calendar':
        return <ContentCalendar />;
      case 'composer':
        return <PostComposer />;
      case 'comments':
        return <CommentFeed />;
      case 'hashtags':
        return <HashtagTracker />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'onboarding':
        return (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Onboarding Tour</h2>
              <p className="text-sm text-slate-400 mb-4">Click below to restart the interactive tour</p>
              <motion.button
                onClick={() => setShowOnboarding(true)}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Tour
              </motion.button>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
              }}
            >
              <div className="absolute inset-0 shimmer" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome to <span className="gradient-text">TrendPulse</span>
                </h2>
                <p className="text-sm text-slate-300">
                  Real-time trend aggregation across X, TikTok, Instagram, Facebook, Reddit & the web.
                  {' '}{filteredNews.length} trending topics found.
                </p>
              </div>
              <div className="absolute top-2 right-8 w-20 h-20 rounded-full bg-blue-500/10 blur-xl" />
              <div className="absolute bottom-0 right-24 w-16 h-16 rounded-full bg-purple-500/10 blur-xl" />
            </motion.div>

            {/* Advanced Search */}
            <AdvancedSearch isOpen={true} onClose={() => {}} onApply={() => {}} />

            {/* Drag & Drop Dashboard */}
            <DragDropDashboard />

            {/* News Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Trending Now
                  <span className="text-sm text-slate-400 font-normal ml-2">
                    ({filteredNews.length} results)
                  </span>
                </h3>
                <div className="flex gap-2">
                  {['Hot', 'New', 'Rising'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filter === 'Hot'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${searchQuery}-${activePlatform}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  <InfiniteScroll pageSize={6}>
                    {filteredNews.map((item, index) => (
                      <NewsCard key={item.id} item={item} index={index} />
                    ))}
                  </InfiniteScroll>
                </motion.div>
              </AnimatePresence>

              {filteredNews.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-12 text-center"
                >
                  <p className="text-lg text-slate-400 mb-2">No trends found</p>
                  <p className="text-sm text-slate-500">Try adjusting your search or platform filters</p>
                </motion.div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        <Header
          onSearch={setSearchQuery}
          onPlatformFilter={setActivePlatform}
          activePlatform={activePlatform}
        />
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onToggleNotifications={handleToggleNotifications}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;
