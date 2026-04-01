import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Share2, Zap } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function formatStatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export default function StatsBar() {
  const newsItems = useQuery(api.news.list, {});

  const stats = useMemo(() => {
    const items = newsItems ?? [];
    const trendingCount = items.filter((n) => n.status === 'trending').length;
    const totalImpressions = items.reduce(
      (acc, n) => acc + n.metricsLikes + n.metricsShares + n.metricsComments,
      0
    );
    const autoPosted = items.filter((n) => n.isAutoPostEnabled).length;
    const avgVelocity = items.length
      ? items.reduce((acc, n) => acc + n.metricsVelocity, 0) / items.length
      : 0;

    return [
      {
        label: 'Trending Now',
        value: formatStatNumber(trendingCount),
        change: '+12.5%',
        positive: true,
        icon: TrendingUp,
        gradient: 'from-orange-500 to-orange-400',
      },
      {
        label: 'Total Impressions',
        value: formatStatNumber(totalImpressions),
        change: '+8.3%',
        positive: true,
        icon: Eye,
        gradient: 'from-deep-orange-600 to-orange-400',
      },
      {
        label: 'Auto-Posted',
        value: formatStatNumber(autoPosted),
        change: '+23.1%',
        positive: true,
        icon: Share2,
        gradient: 'from-orange-400 to-amber-400',
      },
      {
        label: 'Velocity Score',
        value: (avgVelocity / 1000).toFixed(1),
        change: '+5.2%',
        positive: true,
        icon: Zap,
        gradient: 'from-deep-orange-700 to-orange-500',
      },
    ];
  }, [newsItems]);
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
          <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
