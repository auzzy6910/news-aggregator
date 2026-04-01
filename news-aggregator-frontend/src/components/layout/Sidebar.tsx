import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  PenTool,
  Share2,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  GitCompareArrows,
  Download,
  Calendar,
  Edit3,
  MessageCircle,
  Hash,
  Bookmark,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'comparison', label: 'Compare', icon: GitCompareArrows },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'geographic', label: 'Geographic', icon: MapPin },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'composer', label: 'Composer', icon: Edit3 },
  { id: 'comments', label: 'Engagement', icon: MessageCircle },
  { id: 'hashtags', label: 'Hashtags', icon: Hash },
  { id: 'content', label: 'AI Content', icon: PenTool },
  { id: 'social', label: 'Social Hub', icon: Share2 },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'onboarding', label: 'Tour', icon: HelpCircle },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-slate-800/60"
      style={{ background: 'linear-gradient(180deg, #0f1629 0%, #0a0e1a 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5 text-white" />
        </motion.div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-lg font-bold gradient-text whitespace-nowrap">TrendPulse</h1>
            <p className="text-xs text-slate-500 whitespace-nowrap">Real-time Aggregator</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))' }}
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }}
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 relative z-10 ${isActive ? 'text-blue-400' : ''}`} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-slate-800/60">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
