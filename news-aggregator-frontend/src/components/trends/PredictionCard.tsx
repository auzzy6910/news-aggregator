import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Zap, Clock, ArrowUpRight } from 'lucide-react';
import { PredictionItem } from '../../types';
import PlatformIcon from '../layout/PlatformIcon';

interface PredictionCardProps {
  item: PredictionItem;
  index: number;
}

export default function PredictionCard({ item, index }: PredictionCardProps) {
  const confidenceColor =
    item.confidence >= 85
      ? 'text-emerald-400'
      : item.confidence >= 70
        ? 'text-orange-500'
        : item.confidence >= 50
          ? 'text-amber-400'
          : 'text-gray-400';

  const confidenceBg =
    item.confidence >= 85
      ? 'bg-emerald-500/10'
      : item.confidence >= 70
        ? 'bg-orange-500/10'
        : item.confidence >= 50
          ? 'bg-amber-500/10'
          : 'bg-gray-200';

  const progressWidth = Math.min((item.currentScore / item.predictedPeak) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card glass-card-hover rounded-2xl p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${confidenceBg} ${confidenceColor} text-xs font-bold px-2 py-0.5 rounded-md`}>
              {item.confidence}% confidence
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.timeToTrend}
            </span>
          </div>
          <h4 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.topic}
          </h4>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg">
          <ArrowUpRight className="w-5 h-5" />
          {item.velocity.toFixed(1)}x
        </div>
      </div>

      {/* Mini chart */}
      <div className="h-20 mb-4 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={item.dataPoints}>
            <defs>
              <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5722" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#1e293b',
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#FF5722"
              fill={`url(#gradient-${item.id})`}
              strokeWidth={2}
              strokeDasharray={item.dataPoints.findIndex(p => p.time === 'Now') > -1 ? undefined : undefined}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-500">Current: {item.currentScore}</span>
          <span className="text-gray-500">Predicted Peak: {item.predictedPeak}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF5722, #E64A19)' }}
          />
        </div>
      </div>

      {/* Platforms */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {item.platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} size="sm" />
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-orange-500">
          <Zap className="w-3 h-3" />
          High probability
        </div>
      </div>
    </motion.div>
  );
}
