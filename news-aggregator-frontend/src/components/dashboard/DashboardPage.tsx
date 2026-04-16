import { motion, AnimatePresence } from 'framer-motion';
import { useData, SortMode } from '../../context/DataProvider';
import StatsBar from './StatsBar';
import TrendChart from './TrendChart';
import NewsCard from './NewsCard';

const sortFilters: { label: string; value: SortMode }[] = [
  { label: 'Hot', value: 'hot' },
  { label: 'New', value: 'new' },
  { label: 'Rising', value: 'rising' },
];

export default function DashboardPage() {
  const { filteredNews, searchQuery, activePlatform, sortMode, setSortMode } = useData();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,87,34,0.08), rgba(230,74,25,0.08), rgba(191,54,12,0.05))',
        }}
      >
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome to <span className="gradient-text">TrendPulse</span>
          </h2>
          <p className="text-sm text-gray-500">
            Real-time trend aggregation across X, TikTok, Instagram, Facebook, Reddit &amp; the
            web. {filteredNews.length} trending topics found.
          </p>
        </div>
        <div className="absolute top-2 right-8 w-20 h-20 rounded-full bg-orange-500/10 blur-xl" />
        <div className="absolute bottom-0 right-24 w-16 h-16 rounded-full bg-deep-orange-500/10 blur-xl" />
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
            <span className="text-sm text-gray-400 font-normal ml-2">
              ({filteredNews.length} results)
            </span>
          </h3>
          <div className="flex gap-2">
            {sortFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSortMode(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortMode === filter.value
                    ? 'bg-orange-500/15 text-orange-600 border border-orange-500/25'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${searchQuery}-${activePlatform}-${sortMode}`}
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
            className="glass-card rounded-2xl p-12 text-center"
          >
            <p className="text-lg text-gray-400 mb-2">No trends found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your search or platform filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
