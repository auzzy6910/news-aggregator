import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  RefreshCw,
  Filter,
  ChevronDown,
  TrendingUp,
  Send,
  Zap,
  Info,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { Platform } from '../../types';
import { useData, Notification } from '../../context/DataProvider';
import PlatformIcon from './PlatformIcon';

interface HeaderProps {
  onSearch: (query: string) => void;
  onPlatformFilter: (platform: Platform | 'all') => void;
  activePlatform: Platform | 'all';
}

const platforms: (Platform | 'all')[] = ['all', 'twitter', 'tiktok', 'instagram', 'facebook', 'reddit'];

const notifIconMap: Record<Notification['type'], typeof TrendingUp> = {
  trend: TrendingUp,
  post: Send,
  velocity: Zap,
  system: Info,
};

const notifColorMap: Record<Notification['type'], string> = {
  trend: 'text-emerald-400 bg-emerald-500/10',
  post: 'text-blue-400 bg-blue-500/10',
  velocity: 'text-orange-500 bg-orange-500/10',
  system: 'text-gray-400 bg-gray-200',
};

export default function Header({ onSearch, onPlatformFilter, activePlatform }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { notifications, markNotificationRead, clearNotifications, unreadCount } = useData();
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Notifications dropdown */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-orange-600 hover:text-orange-500"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const Icon = notifIconMap[notif.type];
                        const colorClass = notifColorMap[notif.type];
                        return (
                          <button
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                              !notif.read ? 'bg-orange-50/50' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-deep-orange-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              TP
            </div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">TrendPulse Admin</p>
                    <p className="text-xs text-gray-400">admin@trendpulse.io</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
