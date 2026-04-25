import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow,
  Zap,
  Film,
  Combine,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Mic,
  Volume2,
} from 'lucide-react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import PlatformIcon from '../layout/PlatformIcon';
import type { Platform } from '../../types';

type JobStatus =
  | 'pending'
  | 'generating_video'
  | 'narrating'
  | 'combining_clips'
  | 'posting'
  | 'completed'
  | 'failed'
  | 'cancelled';

type JobStage =
  | 'trigger'
  | 'video'
  | 'narrate'
  | 'combine'
  | 'post'
  | 'done';

const STAGE_ORDER: JobStage[] = [
  'trigger',
  'video',
  'narrate',
  'combine',
  'post',
  'done',
];

const stageMeta: Record<JobStage, { label: string; icon: typeof Zap }> = {
  trigger: { label: 'Queued', icon: Zap },
  video: { label: 'Create Video', icon: Film },
  narrate: { label: 'Narrate', icon: Mic },
  combine: { label: 'Combine Clips', icon: Combine },
  post: { label: 'Auto Post', icon: Send },
  done: { label: 'Done', icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: JobStatus }) {
  const config: Record<
    JobStatus,
    { label: string; color: string; bg: string; icon: typeof Clock }
  > = {
    pending: { label: 'Pending', color: '#64748b', bg: 'rgba(100,116,139,0.15)', icon: Clock },
    generating_video: {
      label: 'Generating Video',
      color: '#f97316',
      bg: 'rgba(249,115,22,0.15)',
      icon: Loader2,
    },
    narrating: {
      label: 'Narrating',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.15)',
      icon: Loader2,
    },
    combining_clips: {
      label: 'Combining Clips',
      color: '#eab308',
      bg: 'rgba(234,179,8,0.15)',
      icon: Loader2,
    },
    posting: {
      label: 'Posting',
      color: '#0ea5e9',
      bg: 'rgba(14,165,233,0.15)',
      icon: Loader2,
    },
    completed: {
      label: 'Completed',
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.15)',
      icon: CheckCircle2,
    },
    failed: { label: 'Failed', color: '#dc2626', bg: 'rgba(220,38,38,0.15)', icon: XCircle },
    cancelled: { label: 'Cancelled', color: '#64748b', bg: 'rgba(100,116,139,0.15)', icon: XCircle },
  };
  const c = config[status];
  const Icon = c.icon;
  const spinning =
    status === 'generating_video' ||
    status === 'narrating' ||
    status === 'combining_clips' ||
    status === 'posting';
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      <Icon className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} />
      {c.label}
    </span>
  );
}

function StageTimeline({ stage, status }: { stage: JobStage; status: JobStatus }) {
  const activeIdx = STAGE_ORDER.indexOf(stage);
  const failed = status === 'failed' || status === 'cancelled';
  return (
    <div className="flex items-center gap-2 py-2">
      {STAGE_ORDER.map((s, i) => {
        const meta = stageMeta[s];
        const Icon = meta.icon;
        const isActive = i === activeIdx && !failed && status !== 'completed';
        const isDone = i < activeIdx || status === 'completed';
        const isFailed = failed && i === activeIdx;
        const color = isFailed
          ? '#dc2626'
          : isDone
            ? '#16a34a'
            : isActive
              ? '#f97316'
              : '#cbd5e1';
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
              title={meta.label}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`}
              />
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function JobDetails({ jobId }: { jobId: Id<'automationJobs'> }) {
  const job = useQuery(api.automation.getJob, { id: jobId });
  if (!job) return null;
  return (
    <div className="mt-3 space-y-4 border-t border-gray-200 pt-4">
      {job.prompt && (
        <div>
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Prompt
          </h4>
          <p className="text-sm text-gray-800 leading-relaxed">{job.prompt}</p>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Clips ({job.clips.length})
        </h4>
        {job.clips.length === 0 ? (
          <p className="text-xs text-gray-400">No clips generated yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {job.clips.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700 uppercase">
                    #{c.index + 1} · {c.provider}
                  </span>
                  <StatusBadge
                    status={
                      c.status === 'ready'
                        ? 'completed'
                        : c.status === 'failed'
                          ? 'failed'
                          : 'pending'
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.prompt}</p>
                {c.clipUrl && (
                  <a
                    href={c.clipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-orange-600 hover:underline"
                  >
                    <Play className="w-3 h-3" /> Open clip
                  </a>
                )}
                {c.error && (
                  <p className="text-[11px] text-red-600 mt-1">{c.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(job.narrationProvider || job.narrationUrl || job.narrationText) && (
        <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
              Narration
            </h4>
            {job.narrationProvider && (
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full capitalize">
                {job.narrationProvider}
              </span>
            )}
            {job.narrationVoice && (
              <span className="text-[11px] text-purple-600">
                voice: {job.narrationVoice}
              </span>
            )}
          </div>
          {job.narrationText && (
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {job.narrationText}
            </p>
          )}
          {job.narrationUrl && (
            <a
              href={job.narrationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-purple-700 hover:underline break-all"
            >
              <Play className="w-3 h-3" /> Open narration audio
            </a>
          )}
        </div>
      )}

      {job.finalVideoUrl && (
        <div>
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Final video
          </h4>
          <a
            href={job.finalVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-orange-600 hover:underline break-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {job.finalVideoUrl}
          </a>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Posts ({job.posts.length})
        </h4>
        {job.posts.length === 0 ? (
          <p className="text-xs text-gray-400">No posts yet.</p>
        ) : (
          <div className="space-y-2">
            {job.posts.map((p) => (
              <div
                key={p.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <PlatformIcon platform={p.platform as Platform} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 capitalize">
                      {p.platform}
                    </span>
                    <StatusBadge
                      status={
                        p.status === 'success'
                          ? 'completed'
                          : p.status === 'failed'
                            ? 'failed'
                            : 'cancelled'
                      }
                    />
                  </div>
                  {p.message && (
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line break-words">
                      {p.message}
                    </p>
                  )}
                  {p.postUrl && (
                    <a
                      href={p.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-orange-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> View post
                    </a>
                  )}
                  {p.error && (
                    <p className="text-[11px] text-red-600 mt-1 break-words">
                      {p.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {job.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold text-red-700 mb-1">Error</p>
          <p className="text-xs text-red-600 whitespace-pre-line break-words">
            {job.error}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AutomationPage() {
  const jobs = useQuery(api.automation.listJobs, { limit: 50 }) ?? [];
  const stats = useQuery(api.automation.stats);
  const newsData = useQuery(api.news.list, {});
  const triggerAutomation = useAction(api.automation.triggerAutomation);
  const triggerAllTrending = useAction(api.automation.triggerAllTrending);
  const cancelJob = useMutation(api.automation.cancelJob);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string>('');
  const [triggering, setTriggering] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);

  const availableNews = useMemo(
    () => (newsData ?? []).filter((n) => n.status !== 'posted').slice(0, 30),
    [newsData]
  );

  const handleTrigger = async () => {
    if (!selectedNewsId) return;
    setTriggering(true);
    try {
      await triggerAutomation({
        newsId: selectedNewsId as Id<'news'>,
      });
    } finally {
      setTriggering(false);
    }
  };

  const handleBulkTrigger = async () => {
    setBulkRunning(true);
    try {
      await triggerAllTrending();
    } finally {
      setBulkRunning(false);
    }
  };

  const cards = [
    {
      label: 'Total runs',
      value: stats?.total ?? 0,
      icon: Workflow,
      gradient: 'from-orange-500 to-deep-orange-600',
    },
    {
      label: 'Running',
      value: stats?.running ?? 0,
      icon: Loader2,
      gradient: 'from-blue-500 to-sky-400',
    },
    {
      label: 'Completed',
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-green-400',
    },
    {
      label: 'Failed',
      value: stats?.failed ?? 0,
      icon: XCircle,
      gradient: 'from-rose-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-deep-orange-600 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            Automation Pipeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate video clips, combine them, and auto-post to every connected platform.
          </p>
        </div>
        <button
          onClick={handleBulkTrigger}
          disabled={bulkRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-orange-500 to-deep-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
        >
          {bulkRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Run on all trending
        </button>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {c.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {c.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center`}
              >
                <c.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trigger new run */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-600" />
          Run pipeline on a news item
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedNewsId}
            onChange={(e) => setSelectedNewsId(e.target.value)}
            className="flex-1 min-w-[260px] rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select a news item…</option>
            {availableNews.map((n) => (
              <option key={n._id} value={n._id}>
                {n.title.slice(0, 80)} · score {Math.round(n.trendScore)}
              </option>
            ))}
          </select>
          <button
            onClick={handleTrigger}
            disabled={!selectedNewsId || triggering}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-400 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {triggering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Trigger pipeline
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Posts to all 5 platforms (Twitter, TikTok, Instagram, Facebook, Reddit).
          Stages run in stub mode until provider API keys are configured in Convex.
        </p>
      </motion.div>

      {/* Runs list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-orange-600" />
          Recent runs
        </h3>
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            No automation runs yet. Trigger one above or wait for the cron to fire.
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const isOpen = expanded === job.id;
              return (
                <div
                  key={job.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {job.news?.imageUrl && (
                      <img
                        src={job.news.imageUrl}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {job.news?.title ?? '(news deleted)'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>
                              {new Date(job.startedAt).toLocaleTimeString()}
                            </span>
                            {job.news && (
                              <>
                                <span>·</span>
                                <span>{job.news.category}</span>
                                <span>·</span>
                                <span>score {Math.round(job.news.trendScore)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={job.status as JobStatus} />
                          <button
                            onClick={() =>
                              setExpanded(isOpen ? null : job.id)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-all"
                            aria-label={isOpen ? 'Collapse' : 'Expand'}
                          >
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <StageTimeline
                        stage={job.stage as JobStage}
                        status={job.status as JobStatus}
                      />
                      <div className="flex items-center gap-3 flex-wrap">
                        {(job.postPlatforms ?? []).map((p) => (
                          <PlatformIcon
                            key={p}
                            platform={p as Platform}
                            size="sm"
                          />
                        ))}
                        {job.status !== 'completed' &&
                          job.status !== 'failed' &&
                          job.status !== 'cancelled' && (
                            <button
                              onClick={() =>
                                cancelJob({
                                  id: job.id as Id<'automationJobs'>,
                                })
                              }
                              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <JobDetails
                          jobId={job.id as Id<'automationJobs'>}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
