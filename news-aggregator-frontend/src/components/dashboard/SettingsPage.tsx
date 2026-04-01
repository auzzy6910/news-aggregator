import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Palette,
  Shield,
  Globe,
  Key,
  RefreshCw,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<SettingToggle[]>([
    { id: '1', label: 'Trend Alerts', description: 'Get notified when new trends are detected', enabled: true },
    { id: '2', label: 'Auto-Post Confirmations', description: 'Receive confirmation when content is auto-posted', enabled: true },
    { id: '3', label: 'Velocity Spikes', description: 'Alert when engagement velocity exceeds threshold', enabled: false },
    { id: '4', label: 'Weekly Digest', description: 'Summary of top trends and performance metrics', enabled: true },
  ]);

  const [refreshInterval, setRefreshInterval] = useState(5);
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure your aggregator preferences and security settings
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Notifications
        </h3>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white">{notif.label}</p>
                <p className="text-xs text-slate-400">{notif.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(notif.id)}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  notif.enabled ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ left: notif.enabled ? '22px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Refresh */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400" />
          Data Refresh Settings
        </h3>
        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            Refresh Interval: <span className="text-blue-400 font-medium">{refreshInterval} minutes</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>1 min</span>
            <span>15 min</span>
            <span>30 min</span>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Security & Scraping
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-white">Proxy Rotation</p>
              <p className="text-xs text-slate-400">Enable residential proxy rotation for social media scraping</p>
            </div>
            <button
              onClick={() => setProxyEnabled(!proxyEnabled)}
              className={`relative w-10 h-5 rounded-full transition-all ${
                proxyEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ left: proxyEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-white">Rate Limiting</p>
              <p className="text-xs text-slate-400">Throttle API requests to avoid platform bans</p>
            </div>
            <button
              onClick={() => setRateLimitEnabled(!rateLimitEnabled)}
              className={`relative w-10 h-5 rounded-full transition-all ${
                rateLimitEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ left: rateLimitEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* API Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-400" />
          API Keys
        </h3>
        <div className="space-y-3">
          {[
            { name: 'OpenAI API Key', status: 'configured', icon: Palette },
            { name: 'Meta Graph API', status: 'configured', icon: Globe },
            { name: 'X (Twitter) API', status: 'not configured', icon: Key },
            { name: 'TikTok Trends API', status: 'not configured', icon: Key },
          ].map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="flex items-center gap-3">
                <api.icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-white">{api.name}</span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md ${
                  api.status === 'configured'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {api.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save/Reset */}
      <div className="flex items-center gap-3 pt-2">
        <motion.button
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4" />
          Save Settings
        </motion.button>
        <motion.button
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all"
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>
    </div>
  );
}
