import { motion } from 'framer-motion';
import { Hash, TrendingUp, Eye, Heart } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { mockHashtagMetrics } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function HashtagTracker() {
  const sortedHashtags = [...mockHashtagMetrics].sort((a, b) => b.engagement - a.engagement);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>
          Hashtag Performance
        </h2>
        <p className="text-sm text-slate-400 mt-1">Track which hashtags drive the most engagement</p>
      </motion.div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hashtags', value: sortedHashtags.length, icon: Hash, color: 'from-purple-500 to-fuchsia-400' },
          { label: 'Total Impressions', value: formatNumber(sortedHashtags.reduce((a, b) => a + b.impressions, 0)), icon: Eye, color: 'from-blue-500 to-cyan-400' },
          { label: 'Total Engagement', value: formatNumber(sortedHashtags.reduce((a, b) => a + b.engagement, 0)), icon: Heart, color: 'from-pink-500 to-rose-400' },
          { label: 'Avg Growth', value: `${(sortedHashtags.reduce((a, b) => a + b.growth, 0) / sortedHashtags.length).toFixed(1)}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Hashtag cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedHashtags.map((hashtag, index) => (
          <motion.div
            key={hashtag.tag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card glass-card-hover rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-white">{hashtag.tag}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  {hashtag.platforms.map((p) => (
                    <PlatformIcon key={p} platform={p} size="sm" />
                  ))}
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                hashtag.growth >= 50 ? 'bg-emerald-500/10 text-emerald-400' :
                hashtag.growth >= 25 ? 'bg-blue-500/10 text-blue-400' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                +{hashtag.growth}%
              </span>
            </div>

            {/* Mini trend chart */}
            <div className="h-16 mb-3 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hashtag.trend.map((v, i) => ({ day: `D${i + 1}`, value: v }))}>
                  <defs>
                    <linearGradient id={`hashtag-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3148', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill={`url(#hashtag-grad-${index})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-lg bg-slate-800/30">
                <p className="text-sm font-bold text-white">{formatNumber(hashtag.impressions)}</p>
                <p className="text-xs text-slate-400">Impressions</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/30">
                <p className="text-sm font-bold text-white">{formatNumber(hashtag.engagement)}</p>
                <p className="text-xs text-slate-400">Engagement</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/30">
                <p className="text-sm font-bold text-white">{formatNumber(hashtag.posts)}</p>
                <p className="text-xs text-slate-400">Posts</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
