import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { trendTimelineData, platformColors } from '../../data/mockData';

export default function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card rounded p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cross-Platform Trend Velocity</h3>
          <p className="text-sm text-gray-500 mt-1">Engagement rate across platforms (last 24h)</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                period === '24h'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendTimelineData}>
            <defs>
              <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={platformColors.twitter} stopOpacity={0.3} />
                <stop offset="95%" stopColor={platformColors.twitter} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTiktok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff0050" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff0050" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={platformColors.instagram} stopOpacity={0.3} />
                <stop offset="95%" stopColor={platformColors.instagram} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={platformColors.facebook} stopOpacity={0.3} />
                <stop offset="95%" stopColor={platformColors.facebook} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReddit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={platformColors.reddit} stopOpacity={0.3} />
                <stop offset="95%" stopColor={platformColors.reddit} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.8)" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : String(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#111827',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
            />
            <Area type="monotone" dataKey="twitter" name="X (Twitter)" stroke={platformColors.twitter} fillOpacity={1} fill="url(#colorTwitter)" strokeWidth={2} />
            <Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#ff0050" fillOpacity={1} fill="url(#colorTiktok)" strokeWidth={2} />
            <Area type="monotone" dataKey="instagram" name="Instagram" stroke={platformColors.instagram} fillOpacity={1} fill="url(#colorInstagram)" strokeWidth={2} />
            <Area type="monotone" dataKey="facebook" name="Facebook" stroke={platformColors.facebook} fillOpacity={1} fill="url(#colorFacebook)" strokeWidth={2} />
            <Area type="monotone" dataKey="reddit" name="Reddit" stroke={platformColors.reddit} fillOpacity={1} fill="url(#colorReddit)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
