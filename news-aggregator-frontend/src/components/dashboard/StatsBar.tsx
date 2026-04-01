import { motion } from 'framer-motion';
import { TrendingUp, Eye, Share2, Zap } from 'lucide-react';

const stats = [
  {
    label: 'Trending Now',
    value: '2,847',
    change: '+12.5%',
    positive: true,
    icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    label: 'Total Impressions',
    value: '14.2M',
    change: '+8.3%',
    positive: true,
    icon: Eye,
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    label: 'Auto-Posted',
    value: '156',
    change: '+23.1%',
    positive: true,
    icon: Share2,
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    label: 'Velocity Score',
    value: '94.7',
    change: '+5.2%',
    positive: true,
    icon: Zap,
    gradient: 'from-orange-500 to-amber-400',
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                stat.positive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-xs text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
