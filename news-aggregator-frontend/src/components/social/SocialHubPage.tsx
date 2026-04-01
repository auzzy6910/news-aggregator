import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Link2,
  Unlink,
  Users,
  Zap,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings2,
} from 'lucide-react';
import { socialAccounts, autoPostRules, mockNews } from '../../data/mockData';
import PlatformIcon from '../layout/PlatformIcon';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function SocialHubPage() {
  const [rules, setRules] = useState(autoPostRules);

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const postedItems = mockNews.filter((n) => n.status === 'posted');
  const scheduledItems = mockNews.filter((n) => n.status === 'scheduled');

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
            <div className="w-10 h-10 rounded bg-orange-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            Social Hub
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage connected accounts, auto-posting rules, and posting queue
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-orange-500" />
            Connected Accounts
          </h3>
          <div className="space-y-3">
            {socialAccounts.map((account) => (
              <div
                key={account.id}
                className={`flex items-center justify-between p-3 rounded border transition-all ${
                  account.connected
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={account.platform} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.handle}</p>
                    {account.connected && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(account.followers)} followers
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                    account.connected
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {account.connected ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Unlink className="w-3 h-3" />
                      Connect
                    </>
                  )}
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auto-Post Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Auto-Post Rules
          </h3>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 rounded bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={rule.platform} size="sm" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {rule.platform === 'twitter' ? 'X' : rule.platform}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative w-10 h-5 rounded-full transition-all ${
                      rule.enabled ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: rule.enabled ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Virality Threshold</span>
                    <span className="text-gray-900 font-medium">{rule.threshold}+</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rule.threshold}%`,
                        background: rule.enabled
                          ? 'linear-gradient(90deg, #ea580c, #f97316)'
                          : '#d1d5db',
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {rule.enabled ? 'Auto-posts when trend score exceeds threshold' : 'Rule disabled'}
                  </p>
                </div>
              </div>
            ))}

            <motion.button
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded text-sm font-medium text-gray-600 bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
              whileTap={{ scale: 0.98 }}
            >
              <Settings2 className="w-4 h-4" />
              Add New Rule
            </motion.button>
          </div>
        </motion.div>

        {/* Posting Queue */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-500" />
            Posting Queue
          </h3>

          {/* Scheduled */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Scheduled ({scheduledItems.length})
            </p>
            <div className="space-y-2">
              {scheduledItems.map((item) => (
                <div key={item.id} className="p-3 rounded bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformIcon platform={item.platform} size="sm" />
                    <span className="text-xs text-amber-600 font-medium">Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      className="text-xs px-2.5 py-1 rounded bg-orange-600 text-white hover:bg-orange-700 transition-all"
                      whileTap={{ scale: 0.95 }}
                    >
                      Post Now
                    </motion.button>
                    <button className="text-xs px-2.5 py-1 rounded text-gray-500 hover:text-red-500 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Posted */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Recently Posted ({postedItems.length})
            </p>
            <div className="space-y-2">
              {postedItems.map((item) => (
                <div key={item.id} className="p-3 rounded bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformIcon platform={item.platform} size="sm" />
                    <span className="text-xs text-green-600 font-medium">Posted</span>
                    {item.isAutoPostEnabled && (
                      <span className="text-xs text-orange-600 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        Auto
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formatNumber(item.metrics.likes)} engagements
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
