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
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-slate-800/60" style={{ background: 'rgba(10, 14, 26, 0.85)' }}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search trending topics, hashtags, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
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
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all"
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </motion.button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity">
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
            <div className="flex items-center gap-2 px-6 py-3 border-t border-slate-800/40">
              <span className="text-xs text-slate-500 mr-2">Platform:</span>
              {platforms.map((platform) => (
                <motion.button
                  key={platform}
                  onClick={() => onPlatformFilter(platform)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePlatform === platform
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
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
