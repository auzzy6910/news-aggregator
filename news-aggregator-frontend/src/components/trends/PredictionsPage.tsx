import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { predictions } from '../../data/mockData';
import PredictionCard from './PredictionCard';

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Trend Prediction Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1 ml-13">
            AI-powered analysis of content velocity to predict what will trend next
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Analysis
          </span>
        </div>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">High Confidence</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {predictions.filter((p) => p.confidence >= 80).length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Topics likely to trend</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">Avg Velocity</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {(predictions.reduce((a, b) => a + b.velocity, 0) / predictions.length).toFixed(1)}x
          </p>
          <p className="text-xs text-slate-500 mt-1">Engagement acceleration</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Monitoring</span>
          </div>
          <p className="text-3xl font-bold text-white">{predictions.length}</p>
          <p className="text-xs text-slate-500 mt-1">Topics being tracked</p>
        </motion.div>
      </div>

      {/* Prediction cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((prediction, index) => (
          <PredictionCard key={prediction.id} item={prediction} index={index} />
        ))}
      </div>
    </div>
  );
}
