import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Heart,
  Share2,
  MessageCircle,
  Zap,
  ChevronDown,
  Send,
  Copy,
  Play,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';
import { NewsItem } from '../../types';
import PlatformIcon from '../layout/PlatformIcon';
import { useBookmarks } from '../../contexts/BookmarkContext';

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  trending: { label: 'Trending', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  draft: { label: 'Draft', bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
  scheduled: { label: 'Scheduled', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  posted: { label: 'Posted', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
};

const sentimentConfig = {
  positive: { icon: ThumbsUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Positive' },
  negative: { icon: ThumbsDown, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Negative' },
  neutral: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Neutral' },
};

export default function NewsCard({ item, index }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(item.id);
  const status = statusConfig[item.status];
  const sentiment = item.sentiment ? sentimentConfig[item.sentiment] : null;
  const SentimentIcon = sentiment?.icon;

  const trendScoreColor =
    item.trendScore >= 90
      ? 'text-emerald-400'
      : item.trendScore >= 70
        ? 'text-blue-400'
        : item.trendScore >= 50
          ? 'text-amber-400'
          : 'text-slate-400';

  const trendScoreBg =
    item.trendScore >= 90
      ? 'from-emerald-500/20 to-emerald-500/5'
      : item.trendScore >= 70
        ? 'from-blue-500/20 to-blue-500/5'
        : item.trendScore >= 50
          ? 'from-amber-500/20 to-amber-500/5'
          : 'from-slate-500/20 to-slate-500/5';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgError ? 'https://placehold.co/600x400/1a1f2e/3b82f6?text=TrendPulse' : item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <PlatformIcon platform={item.platform} size="md" />
          <span className={`${status.bg} ${status.text} text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
            {status.label}
          </span>
          {sentiment && SentimentIcon && (
            <span className={`${sentiment.bg} ${sentiment.color} text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm`}>
              <SentimentIcon className="w-3 h-3" />
              {sentiment.label}
            </span>
          )}
        </div>

        {/* Trend score */}
        <div className="absolute top-3 right-3">
          <div className={`bg-gradient-to-br ${trendScoreBg} backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10`}>
            <div className="flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${trendScoreColor}`} />
              <span className={`text-sm font-bold ${trendScoreColor}`}>{item.trendScore}</span>
            </div>
          </div>
        </div>

        {/* Video play button */}
        {item.videoUrl && (
          <motion.button
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </motion.button>
        )}

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-lg px-2.5 py-1 text-xs text-white/80">
          <MapPin className="w-3 h-3" />
          <span>{item.location.region}, {item.location.country}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Time */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {item.category}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(item.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.summary}</p>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            {formatNumber(item.metrics.likes)}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            {formatNumber(item.metrics.shares)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            {formatNumber(item.metrics.comments)}
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold ml-auto">
            <TrendingUp className="w-3.5 h-3.5" />
            {formatNumber(item.metrics.velocity)}/hr
          </span>
        </div>

        {/* Bookmark button */}
        <div className="flex items-center justify-between mb-3">
          <div />
          <motion.button
            onClick={() => toggleBookmark(item.id)}
            className={`p-1.5 rounded-lg transition-all ${bookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/50'}`}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.hashtags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-slate-800/60 text-blue-400/80 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand/Collapse */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors mb-3"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show less' : 'Show AI draft & actions'}
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* AI Draft toggle */}
              <button
                onClick={() => setShowDraft(!showDraft)}
                className="flex items-center gap-2 text-sm font-medium text-purple-400 mb-2 hover:text-purple-300 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {showDraft ? 'Hide' : 'View'} AI-Recreated Draft
              </button>

              {showDraft && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-3"
                >
                  <p className="text-sm text-slate-300 leading-relaxed">{item.aiDraft}</p>
                  <button className="flex items-center gap-1.5 text-xs text-purple-400 mt-2 hover:text-purple-300">
                    <Copy className="w-3 h-3" />
                    Copy draft
                  </button>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/50">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Now
                </motion.button>
                <motion.a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Source
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
