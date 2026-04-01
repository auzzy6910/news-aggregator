import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp, Send, Zap, Info, Check, X } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { Notification } from '../../types';
import PlatformIcon from '../layout/PlatformIcon';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const typeIcons: Record<Notification['type'], typeof TrendingUp> = {
  trend_alert: TrendingUp,
  auto_post: Send,
  velocity_spike: Zap,
  system: Info,
};

const typeColors: Record<Notification['type'], string> = {
  trend_alert: 'text-blue-400',
  auto_post: 'text-emerald-400',
  velocity_spike: 'text-amber-400',
  system: 'text-slate-400',
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[480px] glass-card rounded-2xl border border-slate-700/50 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.map((notif) => {
                const Icon = typeIcons[notif.type];
                return (
                  <motion.div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`flex items-start gap-3 p-4 border-b border-slate-800/30 cursor-pointer transition-colors hover:bg-slate-800/30 ${
                      !notif.read ? 'bg-blue-500/5' : ''
                    }`}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className={`mt-0.5 ${typeColors[notif.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-slate-500">{timeAgo(notif.timestamp)}</span>
                        {notif.platform && (
                          <PlatformIcon platform={notif.platform} size="sm" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
