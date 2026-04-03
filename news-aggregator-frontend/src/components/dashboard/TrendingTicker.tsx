import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { TrendingUp, Zap } from 'lucide-react';
import PlatformIcon from '../layout/PlatformIcon';
import { Platform } from '../../types';

export default function TrendingTicker() {
  const newsData = useQuery(api.news.list, {});
  const items = newsData ?? [];

  if (items.length === 0) return null;

  // Duplicate items so the marquee loops seamlessly
  const tickerItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/80">
      {/* Left label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-deep-orange-600 text-white text-xs font-bold rounded-l-xl shadow-md">
        <TrendingUp className="w-3.5 h-3.5" />
        LIVE
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>

      {/* Fade edges */}
      <div className="absolute left-20 top-0 bottom-0 w-8 z-[5] pointer-events-none bg-gradient-to-r from-orange-50/80 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-[5] pointer-events-none bg-gradient-to-l from-orange-50/80 to-transparent" />

      {/* Scrolling content */}
      <div className="ticker-track flex items-center gap-6 py-2.5 pl-24 pr-4 whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <PlatformIcon platform={item.platform as Platform} size="sm" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
              {item.title}
            </span>
            <span className="flex items-center gap-0.5 text-xs text-emerald-500 font-semibold">
              <Zap className="w-3 h-3" />
              {item.trendScore}
            </span>
            <span className="text-gray-300 mx-1">|</span>
          </a>
        ))}
      </div>
    </div>
  );
}
