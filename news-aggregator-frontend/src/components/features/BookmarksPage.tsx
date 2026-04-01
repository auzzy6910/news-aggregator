import { motion } from 'framer-motion';
import { Bookmark, Trash2 } from 'lucide-react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { mockNews } from '../../data/mockData';
import NewsCard from '../dashboard/NewsCard';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const savedItems = mockNews.filter((item) => bookmarks.includes(item.id));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            Saved Trends
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {savedItems.length} bookmarked trend{savedItems.length !== 1 ? 's' : ''}
          </p>
        </div>
        {savedItems.length > 0 && (
          <button
            onClick={() => savedItems.forEach((item) => toggleBookmark(item.id))}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </motion.div>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedItems.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg text-slate-400 mb-2">No saved trends yet</p>
          <p className="text-sm text-slate-500">Click the bookmark icon on any trend card to save it here</p>
        </motion.div>
      )}
    </div>
  );
}
