import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Copy,
  RefreshCw,
  Send,
  PenTool,
  Wand2,
  MessageSquare,
  Hash,
  Type,
  Settings2,
} from 'lucide-react';
import { mockNews } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';

const toneOptions = ['Professional', 'Casual', 'Witty', 'Informative', 'Provocative'];
const lengthOptions = ['Short (< 280 chars)', 'Medium (1-2 paragraphs)', 'Long (Thread/Article)'];

export default function ContentPage() {
  const [selectedNews, setSelectedNews] = useState(mockNews[0]);
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedLength, setSelectedLength] = useState('Short (< 280 chars)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(selectedNews.aiDraft);
  const [hashtagCount, setHashtagCount] = useState(5);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(selectedNews.aiDraft);
      setIsGenerating(false);
    }, 2000);
  };

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
              <PenTool className="w-5 h-5 text-white" />
            </div>
            AI Content Studio
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Recreate trending content with AI-powered brand voice customization
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Source selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-600" />
            Select Source Content
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {mockNews.map((news) => (
              <button
                key={news.id}
                onClick={() => {
                  setSelectedNews(news);
                  setGeneratedContent(news.aiDraft);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedNews.id === news.id
                    ? 'bg-orange-500/10 border border-orange-500/30'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <PlatformIcon platform={news.platform} size="sm" />
                  <span className="text-xs text-gray-400 capitalize">
                    {news.platform === 'twitter' ? 'X' : news.platform}
                  </span>
                </div>
                <p className="text-sm text-gray-900 line-clamp-2 leading-snug">{news.title}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Center: Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5 space-y-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-orange-600" />
            Content Configuration
          </h3>

          {/* Tone selector */}
          <div>
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
              <Type className="w-3 h-3" />
              Brand Voice / Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedTone === tone
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Length selector */}
          <div>
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Content Length
            </label>
            <div className="space-y-1.5">
              {lengthOptions.map((length) => (
                <button
                  key={length}
                  onClick={() => setSelectedLength(length)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedLength === length
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag count */}
          <div>
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
              <Hash className="w-3 h-3" />
              Hashtag Count: {hashtagCount}
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={hashtagCount}
              onChange={(e) => setHashtagCount(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>15</span>
            </div>
          </div>

          {/* Generate button */}
          <motion.button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FF5722, #E64A19)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate AI Content
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Right: Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            AI-Generated Draft
          </h3>

          {/* Source preview */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-400 mb-1.5">Original Source:</p>
            <p className="text-sm text-gray-600 line-clamp-3">{selectedNews.summary}</p>
          </div>

          {/* Generated content */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 min-h-32 relative">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-orange-600">AI is crafting your content...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {generatedContent}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedNews.hashtags.map((tag) => (
                    <span key={tag} className="text-xs text-orange-600/80 bg-orange-100 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #FF5722, #E64A19)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-3.5 h-3.5" />
              Post Now
            </motion.button>
            <motion.button
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
