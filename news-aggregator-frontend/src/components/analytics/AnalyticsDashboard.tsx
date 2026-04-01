import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import { mockNews } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';
import { Platform } from '../../types';

const engagementOverTime = [
  { date: 'Mar 25', likes: 45000, shares: 12000, comments: 8000 },
  { date: 'Mar 26', likes: 52000, shares: 15000, comments: 9500 },
  { date: 'Mar 27', likes: 48000, shares: 13500, comments: 7800 },
  { date: 'Mar 28', likes: 61000, shares: 18000, comments: 11000 },
  { date: 'Mar 29', likes: 58000, shares: 16500, comments: 10200 },
  { date: 'Mar 30', likes: 72000, shares: 21000, comments: 13500 },
  { date: 'Mar 31', likes: 68000, shares: 19500, comments: 12800 },
  { date: 'Apr 1', likes: 85000, shares: 25000, comments: 15600 },
];

const platformBreakdown = [
  { name: 'X (Twitter)', value: 35, color: '#1DA1F2' },
  { name: 'TikTok', value: 28, color: '#ff0050' },
  { name: 'Instagram', value: 18, color: '#E4405F' },
  { name: 'Facebook', value: 12, color: '#1877F2' },
  { name: 'Reddit', value: 7, color: '#FF4500' },
];

export default function AnalyticsDashboard() {
  const [selectedPost, setSelectedPost] = useState(mockNews[0]);

  const totalEngagement = selectedPost.metrics.likes + selectedPost.metrics.shares + selectedPost.metrics.comments;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Analytics Dashboard
        </h2>
        <p className="text-sm text-slate-400 mt-1">Detailed performance metrics and engagement analysis</p>
      </motion.div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', value: '14.2M', icon: Eye, color: 'from-blue-500 to-cyan-400', change: '+12.5%' },
          { label: 'Engagements', value: '1.48M', icon: Heart, color: 'from-pink-500 to-rose-400', change: '+8.3%' },
          { label: 'Shares', value: '389K', icon: Share2, color: 'from-purple-500 to-indigo-400', change: '+15.7%' },
          { label: 'Comments', value: '98.2K', icon: MessageCircle, color: 'from-amber-500 to-orange-400', change: '+6.1%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Engagement Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 49, 72, 0.4)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3148', borderRadius: '12px', fontSize: '12px', color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="likes" name="Likes" stroke="#ec4899" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="shares" name="Shares" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" name="Comments" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-white mb-4">Platform Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                  {platformBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3148', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {platformBreakdown.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-300">{p.name}</span>
                </span>
                <span className="text-white font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Per-Post Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Per-Post Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {mockNews.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  selectedPost.id === post.id
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <PlatformIcon platform={post.platform as Platform} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{post.title}</p>
                  <p className="text-xs text-slate-400">Score: {post.trendScore}</p>
                </div>
              </button>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-3">{selectedPost.title}</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Likes', value: selectedPost.metrics.likes, fill: '#ec4899' },
                  { name: 'Shares', value: selectedPost.metrics.shares, fill: '#3b82f6' },
                  { name: 'Comments', value: selectedPost.metrics.comments, fill: '#f59e0b' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 49, 72, 0.4)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3148', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[
                      { fill: '#ec4899' },
                      { fill: '#3b82f6' },
                      { fill: '#f59e0b' },
                    ].map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-2 rounded-lg bg-pink-500/10">
                <p className="text-lg font-bold text-pink-400">{(selectedPost.metrics.likes / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-400">Likes</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-500/10">
                <p className="text-lg font-bold text-blue-400">{(selectedPost.metrics.shares / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-400">Shares</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-500/10">
                <p className="text-lg font-bold text-amber-400">{(selectedPost.metrics.comments / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-400">Comments</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-slate-800/30">
              <p className="text-xs text-slate-400">Total Engagement</p>
              <p className="text-xl font-bold text-white">{(totalEngagement / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
