import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import GeographicFilter from './GeographicFilter';
import NewsCard from './NewsCard';

export default function GeographicPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const allNews = useQuery(api.news.list, {}) ?? [];

  const filteredNews = allNews.filter((item) => {
    if (!selectedCountry) return true;
    if (item.location.country !== selectedCountry) return false;
    if (selectedRegion && item.location.region !== selectedRegion) return false;
    return true;
  });

  const regionStats = selectedCountry
    ? {
        totalTrends: filteredNews.length,
        avgScore: filteredNews.length
          ? Math.round(filteredNews.reduce((a, b) => a + b.trendScore, 0) / filteredNews.length)
          : 0,
        totalEngagement: filteredNews.reduce(
          (a, b) => a + b.metrics.likes + b.metrics.shares + b.metrics.comments,
          0
        ),
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-deep-orange-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Geographic Trends
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Drill down into localized trends by Country, State, or County
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filter */}
        <div className="lg:col-span-1 space-y-4">
          <GeographicFilter
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            onCountryChange={setSelectedCountry}
            onRegionChange={setSelectedRegion}
          />

          {/* Region Stats */}
          {regionStats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-5 space-y-3"
            >
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                Region Insights
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Active Trends
                  </span>
                  <span className="text-gray-900 font-medium">{regionStats.totalTrends}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Avg Score
                  </span>
                  <span className="text-orange-600 font-medium">{regionStats.avgScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Engagement</span>
                  <span className="text-orange-600 font-medium">
                    {regionStats.totalEngagement >= 1000000
                      ? (regionStats.totalEngagement / 1000000).toFixed(1) + 'M'
                      : regionStats.totalEngagement >= 1000
                        ? (regionStats.totalEngagement / 1000).toFixed(1) + 'K'
                        : regionStats.totalEngagement}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: News Grid */}
        <div className="lg:col-span-3">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNews.map((item, index) => (
                <NewsCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center"
            >
              <MapPin className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No trends found</h3>
              <p className="text-sm text-gray-500">
                No trending topics found for this region. Try selecting a different location.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
