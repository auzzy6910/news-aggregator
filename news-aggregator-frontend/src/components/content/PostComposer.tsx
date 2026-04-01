import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Eye, Edit3, Hash, Image, Smile, X } from 'lucide-react';
import { Platform } from '../../types';
import PlatformIcon from '../layout/PlatformIcon';

const platforms: { id: Platform; name: string; maxLength: number }[] = [
  { id: 'twitter', name: 'X (Twitter)', maxLength: 280 },
  { id: 'instagram', name: 'Instagram', maxLength: 2200 },
  { id: 'facebook', name: 'Facebook', maxLength: 63206 },
  { id: 'tiktok', name: 'TikTok', maxLength: 4000 },
  { id: 'reddit', name: 'Reddit', maxLength: 40000 },
];

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'instagram']);
  const [showPreview, setShowPreview] = useState(false);
  const [hashtags, setHashtags] = useState('');

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const fullContent = content + (hashtags ? '\n\n' + hashtags.split(',').map((t) => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).filter(Boolean).join(' ') : '');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          Multi-Platform Composer
        </h2>
        <p className="text-sm text-slate-400 mt-1">Compose and preview posts for multiple platforms at once</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Compose</h3>

          {/* Platform selector */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Target Platforms</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedPlatforms.includes(p.id)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-700/40'
                  }`}
                >
                  <PlatformIcon platform={p.id} size="sm" />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content textarea */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="w-full h-40 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                  <Hash className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-500">{content.length} characters</span>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-xs text-slate-400 mb-2 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Hashtags (comma-separated)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#trending, #news, #viral"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <motion.button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all"
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Post to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            Platform Previews
          </h3>

          {selectedPlatforms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Select at least one platform to preview</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId)!;
                const isOverLimit = fullContent.length > platform.maxLength;

                return (
                  <div key={platformId} className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <PlatformIcon platform={platformId} size="sm" />
                      <span className="text-sm font-medium text-white">{platform.name}</span>
                      <span className={`text-xs ml-auto ${isOverLimit ? 'text-red-400' : 'text-slate-500'}`}>
                        {fullContent.length}/{platform.maxLength}
                      </span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">TP</div>
                        <div>
                          <p className="text-xs font-medium text-white">TrendPulse</p>
                          <p className="text-xs text-slate-500">Just now</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">
                        {fullContent || <span className="text-slate-500 italic">Your post will appear here...</span>}
                      </p>
                      {isOverLimit && (
                        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Content exceeds {platform.name} character limit
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
