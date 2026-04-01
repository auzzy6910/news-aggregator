import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StatsBar from './components/dashboard/StatsBar';
import NewsCard from './components/dashboard/NewsCard';
import TrendChart from './components/dashboard/TrendChart';
import PredictionsPage from './components/trends/PredictionsPage';
import GeographicPage from './components/dashboard/GeographicPage';
import ContentPage from './components/content/ContentPage';
import SocialHubPage from './components/social/SocialHubPage';
import SettingsPage from './components/dashboard/SettingsPage';
import { mockNews } from './data/mockData';
import { Platform } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');

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
      default:
        return (
          <div className="space-y-6">
            {/* Welcome banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded p-6 border"
              style={{
                background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                borderColor: '#fdba74',
              }}
            >
              <div className="absolute inset-0 shimmer" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Welcome to <span className="gradient-text">TrendPulse</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time trend aggregation across X, TikTok, Instagram, Facebook, Reddit & the web.
                  {' '}{filteredNews.length} trending topics found.
                </p>
              </div>
              <div className="absolute top-2 right-8 w-20 h-20 rounded-full bg-orange-300/20 blur-xl" />
              <div className="absolute bottom-0 right-24 w-16 h-16 rounded-full bg-orange-400/15 blur-xl" />
            </motion.div>

            {/* Stats */}
            <StatsBar />

            {/* Trend Chart */}
            <TrendChart />

            {/* News Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trending Now
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({filteredNews.length} results)
                  </span>
                </h3>
                <div className="flex gap-2">
                  {['Hot', 'New', 'Rising'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        filter === 'Hot'
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
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
                  {filteredNews.map((item, index) => (
                    <NewsCard key={item.id} item={item} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredNews.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded p-12 text-center"
                >
                  <p className="text-lg text-gray-500 mb-2">No trends found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or platform filters</p>
                </motion.div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
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
    </div>
  );
}

export default App;
