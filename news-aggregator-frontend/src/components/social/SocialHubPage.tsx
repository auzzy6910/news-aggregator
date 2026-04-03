import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Plus,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataProvider';
import PlatformIcon from '../layout/PlatformIcon';
import { Platform } from '../../types';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

const availablePlatforms: Platform[] = ['twitter', 'tiktok', 'instagram', 'facebook', 'reddit', 'web'];

export default function SocialHubPage() {
  const {
    socialAccounts: socialAccountsData,
    autoPostRules: rules,
    news: allNews,
    toggleRule,
    toggleConnection,
    addRule,
    updateRuleThreshold,
    updateNewsStatus,
  } = useData();

  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRulePlatform, setNewRulePlatform] = useState<Platform>('twitter');
  const [newRuleThreshold, setNewRuleThreshold] = useState(70);

  const postedItems = allNews.filter((n) => n.status === 'posted');
  const scheduledItems = allNews.filter((n) => n.status === 'scheduled');

  const handleAddRule = useCallback(() => {
    addRule({
      platform: newRulePlatform,
      threshold: newRuleThreshold,
      enabled: true,
      accounts: [],
    });
    setShowAddRuleModal(false);
    setNewRulePlatform('twitter');
    setNewRuleThreshold(70);
  }, [addRule, newRulePlatform, newRuleThreshold]);

  const handlePostNow = useCallback((id: string) => {
    updateNewsStatus(id, 'posted');
  }, [updateNewsStatus]);

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
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-orange-600" />
            Connected Accounts
          </h3>
          <div className="space-y-3">
            {socialAccountsData.map((account) => (
              <div
                key={account.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
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
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(account.followers)} followers
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={() => toggleConnection(account.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    account.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-600 border border-orange-500/20 hover:bg-orange-500/20'
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
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Auto-Post Rules
          </h3>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
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
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={rule.threshold}
                    onChange={(e) => updateRuleThreshold(rule.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <p className="text-xs text-gray-400">
                    {rule.enabled ? 'Auto-posts when trend score exceeds threshold' : 'Rule disabled'}
                  </p>
                </div>
              </div>
            ))}

            <motion.button
              onClick={() => setShowAddRuleModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Add New Rule
            </motion.button>
          </div>
        </motion.div>

        {/* Posting Queue */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-600" />
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
                <div key={item.id} className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformIcon platform={item.platform} size="sm" />
                    <span className="text-xs text-orange-600 font-medium">Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      onClick={() => handlePostNow(item.id)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-all"
                      whileTap={{ scale: 0.95 }}
                    >
                      Post Now
                    </motion.button>
                    <button className="text-xs px-2.5 py-1 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
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
                <div key={item.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformIcon platform={item.platform} size="sm" />
                    <span className="text-xs text-emerald-400 font-medium">Posted</span>
                    {item.isAutoPostEnabled && (
                      <span className="text-xs text-orange-500 flex items-center gap-0.5">
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

      {/* Add New Rule Modal */}
      <AnimatePresence>
        {showAddRuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddRuleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Add Auto-Post Rule
                </h3>
                <button
                  onClick={() => setShowAddRuleModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {availablePlatforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setNewRulePlatform(platform)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                          newRulePlatform === platform
                            ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30'
                            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <PlatformIcon platform={platform} size="sm" />
                        <span className="capitalize">
                          {platform === 'twitter' ? 'X' : platform}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Virality Threshold: <span className="text-orange-600 font-medium">{newRuleThreshold}+</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    onClick={handleAddRule}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #FF5722, #E64A19)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAddRuleModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
