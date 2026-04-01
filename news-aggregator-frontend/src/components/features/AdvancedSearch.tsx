import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, Tag, Zap, X, SlidersHorizontal } from 'lucide-react';
import { Platform } from '../../types';

export interface SearchFilters {
  query: string;
  dateFrom: string;
  dateTo: string;
  categories: string[];
  minTrendScore: number;
  maxTrendScore: number;
  locations: string[];
  platforms: Platform[];
  sentiment: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  dateFrom: '',
  dateTo: '',
  categories: [],
  minTrendScore: 0,
  maxTrendScore: 100,
  locations: [],
  platforms: [],
  sentiment: 'all',
};

const allCategories = ['Technology', 'Finance', 'Entertainment', 'Business', 'Automotive', 'Health', 'Food & Culture', 'Space'];
const allLocations = ['Kenya', 'United States', 'United Kingdom', 'Nigeria', 'Germany', 'Thailand'];
const allPlatforms: Platform[] = ['twitter', 'tiktok', 'instagram', 'facebook', 'reddit'];

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
}

export default function AdvancedSearch({ isOpen, onClose, onApply }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const handleReset = () => setFilters(defaultFilters);

  const toggleArrayItem = <K extends keyof SearchFilters>(key: K, value: string) => {
    const arr = filters[key] as string[];
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="glass-card rounded-2xl p-6 space-y-5 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Advanced Filters
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="text-xs text-slate-400 hover:text-white transition-colors">
                  Reset
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Trend Score */}
              <div>
                <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Trend Score: {filters.minTrendScore} - {filters.maxTrendScore}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={filters.minTrendScore}
                    onChange={(e) => setFilters({ ...filters, minTrendScore: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={filters.maxTrendScore}
                    onChange={(e) => setFilters({ ...filters, maxTrendScore: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Location
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => toggleArrayItem('locations', loc)}
                      className={`px-2 py-1 rounded-md text-xs transition-all ${
                        (filters.locations).includes(loc)
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  Sentiment
                </label>
                <div className="flex gap-1.5">
                  {['all', 'positive', 'neutral', 'negative'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters({ ...filters, sentiment: s })}
                      className={`px-2 py-1 rounded-md text-xs capitalize transition-all ${
                        filters.sentiment === s
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                Categories
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleArrayItem('categories', cat)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                      (filters.categories).includes(cat)
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Platforms</label>
              <div className="flex flex-wrap gap-1.5">
                {allPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleArrayItem('platforms', p)}
                    className={`px-2.5 py-1 rounded-md text-xs capitalize transition-all ${
                      (filters.platforms as string[]).includes(p)
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
                    }`}
                  >
                    {p === 'twitter' ? 'X' : p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={() => { onApply(filters); onClose(); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
