import { motion } from 'framer-motion';
import { MessageCircle, Heart, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { mockComments } from '../../data/mockData';
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

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

const sentimentIcons = {
  positive: ThumbsUp,
  negative: ThumbsDown,
  neutral: Minus,
};

const sentimentColors = {
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  neutral: 'text-slate-400',
};

export default function CommentFeed() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          Engagement Feed
        </h2>
        <p className="text-sm text-slate-400 mt-1">Real-time comments and reactions on your content</p>
      </motion.div>

      {/* Feed stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Comments', value: mockComments.length, color: 'from-blue-500 to-cyan-400' },
          { label: 'Positive', value: mockComments.filter((c) => c.sentiment === 'positive').length, color: 'from-emerald-500 to-teal-400' },
          { label: 'Avg Likes', value: Math.round(mockComments.reduce((a, b) => a + b.likes, 0) / mockComments.length), color: 'from-pink-500 to-rose-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <p className="text-2xl font-bold text-white">{formatNumber(stat.value)}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Comment list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Latest Comments</h3>
        <div className="space-y-4">
          {mockComments.map((comment, index) => {
            const SentimentIcon = sentimentIcons[comment.sentiment];
            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{comment.author}</span>
                    <PlatformIcon platform={comment.platform} size="sm" />
                    <span className="text-xs text-slate-500">{timeAgo(comment.timestamp)}</span>
                    <SentimentIcon className={`w-3 h-3 ml-auto ${sentimentColors[comment.sentiment]}`} />
                  </div>
                  <p className="text-sm text-slate-300">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-400" />
                      {formatNumber(comment.likes)}
                    </span>
                    <button className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Reply</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
