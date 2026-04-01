import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  RefreshCw,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Platform } from '../../types';
import PlatformIcon from './PlatformIcon';

interface HeaderProps {
  onSearch: (query: string) => void;
  onPlatformFilter: (platform: Platform | 'all') => void;
  activePlatform: Platform | 'all';
}

const platforms: (Platform | 'all')[] = ['all', 'twitter', 'tiktok', 'instagram', 'facebook', 'reddit'];

export default function Header({ onSearch, onPlatformFilter, activePlatform }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-gray-200" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search trending topics, hashtags, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-600'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-4">
          <motion.button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all"
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </motion.button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-deep-orange-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity">
            TP
          </div>
        </div>
      </div>

      {/* Platform Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 mr-2">Platform:</span>
              {platforms.map((platform) => (
                <motion.button
                  key={platform}
                  onClick={() => onPlatformFilter(platform)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePlatform === platform
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {platform === 'all' ? (
                    <span>All Platforms</span>
                  ) : (
                    <>
                      <PlatformIcon platform={platform} size="sm" />
                      <span className="capitalize">{platform === 'twitter' ? 'X' : platform}</span>
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
