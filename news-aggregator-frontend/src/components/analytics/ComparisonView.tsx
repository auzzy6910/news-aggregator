import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { GitCompare, Plus, X } from 'lucide-react';
import { mockNews } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';
import { NewsItem } from '../../types';

export default function ComparisonView() {
  const [selected, setSelected] = useState<NewsItem[]>([mockNews[0], mockNews[1]]);

  const addItem = (item: NewsItem) => {
    if (selected.length < 4 && !selected.find((s) => s.id === item.id)) {
      setSelected([...selected, item]);
    }
  };

  const removeItem = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const comparisonData = [
    { metric: 'Likes', ...Object.fromEntries(selected.map((s) => [s.title.slice(0, 15), s.metrics.likes])) },
    { metric: 'Shares', ...Object.fromEntries(selected.map((s) => [s.title.slice(0, 15), s.metrics.shares])) },
    { metric: 'Comments', ...Object.fromEntries(selected.map((s) => [s.title.slice(0, 15), s.metrics.comments])) },
    { metric: 'Velocity', ...Object.fromEntries(selected.map((s) => [s.title.slice(0, 15), s.metrics.velocity])) },
  ];

  const radarData = selected.map((item) => ({
    subject: item.title.slice(0, 20),
    likes: Math.min(item.metrics.likes / 5000, 100),
    shares: Math.min(item.metrics.shares / 1500, 100),
    comments: Math.min(item.metrics.comments / 400, 100),
    velocity: Math.min(item.metrics.velocity / 100, 100),
    trendScore: item.trendScore,
  }));

  const barColors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          Comparison View
        </h2>
        <p className="text-sm text-slate-400 mt-1">Compare trends side-by-side across platforms</p>
      </motion.div>

      {/* Selected items */}
      <div className="flex flex-wrap gap-3">
        {selected.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-3 flex items-center gap-3"
            style={{ borderLeft: `3px solid ${barColors[i]}` }}
          >
            <PlatformIcon platform={item.platform} size="sm" />
            <div className="min-w-0">
              <p className="text-sm text-white truncate max-w-48">{item.title}</p>
              <p className="text-xs text-slate-400">Score: {item.trendScore}</p>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        {selected.length < 4 && (
          <div className="relative group">
            <button className="glass-card rounded-xl p-3 flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-dashed border-slate-700/50">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add trend</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-80 max-h-64 glass-card rounded-xl border border-slate-700/50 shadow-xl z-10 overflow-y-auto hidden group-hover:block">
              {mockNews
                .filter((n) => !selected.find((s) => s.id === n.id))
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className="w-full text-left p-3 hover:bg-slate-800/50 flex items-center gap-2 transition-colors"
                  >
                    <PlatformIcon platform={item.platform} size="sm" />
                    <span className="text-sm text-slate-300 truncate">{item.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {selected.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-white mb-4">Metrics Comparison</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 49, 72, 0.4)" />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3148', borderRadius: '12px', fontSize: '12px', color: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {selected.map((s, i) => (
                    <Bar key={s.id} dataKey={s.title.slice(0, 15)} fill={barColors[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-white mb-4">Performance Radar</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { metric: 'Likes', ...Object.fromEntries(radarData.map((r) => [r.subject, r.likes])) },
                  { metric: 'Shares', ...Object.fromEntries(radarData.map((r) => [r.subject, r.shares])) },
                  { metric: 'Comments', ...Object.fromEntries(radarData.map((r) => [r.subject, r.comments])) },
                  { metric: 'Velocity', ...Object.fromEntries(radarData.map((r) => [r.subject, r.velocity])) },
                  { metric: 'Trend Score', ...Object.fromEntries(radarData.map((r) => [r.subject, r.trendScore])) },
                ]}>
                  <PolarGrid stroke="rgba(42, 49, 72, 0.6)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  {radarData.map((r, i) => (
                    <Radar key={r.subject} name={r.subject} dataKey={r.subject} stroke={barColors[i]} fill={barColors[i]} fillOpacity={0.15} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side by side stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-white mb-4">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Metric</th>
                    {selected.map((s, i) => (
                      <th key={s.id} className="text-right py-3 px-4 font-medium" style={{ color: barColors[i] }}>
                        {s.title.slice(0, 25)}...
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Platform', getValue: (s: NewsItem) => s.platform === 'twitter' ? 'X' : s.platform },
                    { label: 'Trend Score', getValue: (s: NewsItem) => String(s.trendScore) },
                    { label: 'Likes', getValue: (s: NewsItem) => s.metrics.likes.toLocaleString() },
                    { label: 'Shares', getValue: (s: NewsItem) => s.metrics.shares.toLocaleString() },
                    { label: 'Comments', getValue: (s: NewsItem) => s.metrics.comments.toLocaleString() },
                    { label: 'Velocity', getValue: (s: NewsItem) => `${s.metrics.velocity}/hr` },
                    { label: 'Sentiment', getValue: (s: NewsItem) => `${s.sentiment} (${(s.sentimentScore * 100).toFixed(0)}%)` },
                    { label: 'Status', getValue: (s: NewsItem) => s.status },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-slate-800/30">
                      <td className="py-2.5 px-4 text-slate-400">{row.label}</td>
                      {selected.map((s) => (
                        <td key={s.id} className="py-2.5 px-4 text-right text-white capitalize">{row.getValue(s)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {selected.length < 2 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <GitCompare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg text-slate-400">Select at least 2 trends to compare</p>
        </div>
      )}
    </div>
  );
}
