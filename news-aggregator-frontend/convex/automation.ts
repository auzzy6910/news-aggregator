import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

const PLATFORMS = [
  "twitter",
  "tiktok",
  "instagram",
  "facebook",
  "reddit",
] as const;

const platformLiteral = v.union(
  v.literal("twitter"),
  v.literal("tiktok"),
  v.literal("instagram"),
  v.literal("facebook"),
  v.literal("reddit")
);

/* -------------------------------------------------------------------------- */
/* Queries                                                                    */
/* -------------------------------------------------------------------------- */

export const listJobs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const jobs = await ctx.db
      .query("automationJobs")
      .withIndex("by_startedAt")
      .order("desc")
      .take(limit ?? 50);
    const withNews = await Promise.all(
      jobs.map(async (job) => {
        const news = await ctx.db.get(job.newsId);
        return {
          ...job,
          id: job._id,
          news: news
            ? {
                id: news._id,
                title: news.title,
                category: news.category,
                platform: news.platform,
                imageUrl: news.imageUrl,
                trendScore: news.trendScore,
              }
            : null,
        };
      })
    );
    return withNews;
  },
});

export const getJob = query({
  args: { id: v.id("automationJobs") },
  handler: async (ctx, { id }) => {
    const job = await ctx.db.get(id);
    if (!job) return null;
    const [news, clips, posts] = await Promise.all([
      ctx.db.get(job.newsId),
      ctx.db
        .query("videoClips")
        .withIndex("by_jobId", (q) => q.eq("jobId", id))
        .collect(),
      ctx.db
        .query("autoPostLog")
        .withIndex("by_jobId", (q) => q.eq("jobId", id))
        .collect(),
    ]);
    return {
      ...job,
      id: job._id,
      news: news
        ? {
            id: news._id,
            title: news.title,
            summary: news.summary,
            aiDraft: news.aiDraft,
            category: news.category,
            platform: news.platform,
            imageUrl: news.imageUrl,
            hashtags: news.hashtags,
            trendScore: news.trendScore,
            originalUrl: news.originalUrl,
          }
        : null,
      clips: clips.map((c) => ({ ...c, id: c._id })),
      posts: posts.map((p) => ({ ...p, id: p._id })),
    };
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("automationJobs")
      .withIndex("by_startedAt")
      .order("desc")
      .take(200);
    const counts = {
      total: jobs.length,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
    };
    for (const j of jobs) {
      if (j.status === "completed") counts.completed++;
      else if (j.status === "failed" || j.status === "cancelled")
        counts.failed++;
      else if (j.status === "pending") counts.pending++;
      else counts.running++;
    }
    return counts;
  },
});

/* -------------------------------------------------------------------------- */
/* Internal queries (used by actions)                                         */
/* -------------------------------------------------------------------------- */

export const _getNews = internalQuery({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const _getJob = internalQuery({
  args: { id: v.id("automationJobs") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const _findTriggerableNews = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rules = await ctx.db.query("autoPostRules").collect();
    const byPlatform = new Map<string, typeof rules>();
    for (const r of rules) {
      if (!r.enabled) continue;
      const list = byPlatform.get(r.platform) ?? [];
      list.push(r);
      byPlatform.set(r.platform, list);
    }
    const trending = await ctx.db
      .query("news")
      .withIndex("by_trendScore")
      .order("desc")
      .take(25);
    const triggered: {
      newsId: Id<"news">;
      platforms: Array<(typeof PLATFORMS)[number]>;
    }[] = [];
    for (const n of trending) {
      const platforms: Array<(typeof PLATFORMS)[number]> = [];
      for (const p of PLATFORMS) {
        const rule = byPlatform.get(p)?.[0];
        if (rule && n.trendScore >= rule.threshold) platforms.push(p);
      }
      if (platforms.length > 0 && n.isAutoPostEnabled) {
        const existing = await ctx.db
          .query("automationJobs")
          .withIndex("by_newsId", (q) => q.eq("newsId", n._id))
          .collect();
        const hasActive = existing.some(
          (j) => j.status !== "failed" && j.status !== "cancelled"
        );
        if (!hasActive) triggered.push({ newsId: n._id, platforms });
      }
    }
    return triggered;
  },
});

/* -------------------------------------------------------------------------- */
/* Internal mutations                                                         */
/* -------------------------------------------------------------------------- */

export const _createJob = internalMutation({
  args: {
    newsId: v.id("news"),
    platforms: v.array(platformLiteral),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("automationJobs", {
      newsId: args.newsId,
      status: "pending",
      stage: "trigger",
      postPlatforms: args.platforms,
      prompt: args.prompt,
      startedAt: now,
      updatedAt: now,
    });
  },
});

export const _updateJob = internalMutation({
  args: {
    id: v.id("automationJobs"),
    patch: v.object({
      status: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("generating_video"),
          v.literal("narrating"),
          v.literal("combining_clips"),
          v.literal("posting"),
          v.literal("completed"),
          v.literal("failed"),
          v.literal("cancelled")
        )
      ),
      stage: v.optional(
        v.union(
          v.literal("trigger"),
          v.literal("video"),
          v.literal("narrate"),
          v.literal("combine"),
          v.literal("post"),
          v.literal("done")
        )
      ),
      videoProvider: v.optional(
        v.union(
          v.literal("runway"),
          v.literal("replicate"),
          v.literal("pika"),
          v.literal("stub")
        )
      ),
      narrationProvider: v.optional(
        v.union(
          v.literal("elevenlabs"),
          v.literal("openai"),
          v.literal("google"),
          v.literal("stub")
        )
      ),
      narrationText: v.optional(v.string()),
      narrationUrl: v.optional(v.string()),
      narrationStorageId: v.optional(v.id("_storage")),
      narrationVoice: v.optional(v.string()),
      clipUrls: v.optional(v.array(v.string())),
      finalVideoUrl: v.optional(v.string()),
      error: v.optional(v.string()),
      completedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

export const _insertClip = internalMutation({
  args: {
    jobId: v.id("automationJobs"),
    index: v.number(),
    provider: v.union(
      v.literal("runway"),
      v.literal("replicate"),
      v.literal("pika"),
      v.literal("stub")
    ),
    externalId: v.optional(v.string()),
    prompt: v.string(),
    clipUrl: v.optional(v.string()),
    durationSec: v.optional(v.number()),
    status: v.union(
      v.literal("queued"),
      v.literal("ready"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("videoClips", { ...args, createdAt: Date.now() });
  },
});

export const _insertPostLog = internalMutation({
  args: {
    jobId: v.id("automationJobs"),
    newsId: v.id("news"),
    platform: platformLiteral,
    account: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    externalPostId: v.optional(v.string()),
    postUrl: v.optional(v.string()),
    message: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("autoPostLog", { ...args, postedAt: Date.now() });
  },
});

export const _markNewsPosted = internalMutation({
  args: { id: v.id("news"), videoUrl: v.optional(v.string()) },
  handler: async (ctx, { id, videoUrl }) => {
    const patch: Partial<Doc<"news">> = { status: "posted" };
    if (videoUrl) patch.videoUrl = videoUrl;
    await ctx.db.patch(id, patch);
  },
});

/* -------------------------------------------------------------------------- */
/* Public mutations & actions                                                 */
/* -------------------------------------------------------------------------- */

export const cancelJob = mutation({
  args: { id: v.id("automationJobs") },
  handler: async (ctx, { id }) => {
    const job = await ctx.db.get(id);
    if (!job) return;
    if (job.status === "completed" || job.status === "failed") return;
    await ctx.db.patch(id, {
      status: "cancelled",
      stage: "done",
      updatedAt: Date.now(),
      completedAt: Date.now(),
    });
  },
});

export const triggerAutomation = action({
  args: {
    newsId: v.id("news"),
    platforms: v.optional(v.array(platformLiteral)),
  },
  handler: async (ctx, { newsId, platforms }): Promise<Id<"automationJobs">> => {
    const selected = platforms ?? [...PLATFORMS];
    const news: Doc<"news"> | null = await ctx.runQuery(
      internal.automation._getNews,
      { id: newsId }
    );
    if (!news) throw new Error(`News ${newsId} not found`);
    const prompt = `${news.title}. ${news.summary}`.slice(0, 500);
    const jobId: Id<"automationJobs"> = await ctx.runMutation(
      internal.automation._createJob,
      { newsId, platforms: selected, prompt }
    );
    await ctx.scheduler.runAfter(
      0,
      internal.automationActions.runOrchestrator,
      { jobId }
    );
    return jobId;
  },
});

export const triggerAllTrending = action({
  args: {},
  handler: async (ctx): Promise<number> => {
    const triggers: Array<{
      newsId: Id<"news">;
      platforms: Array<(typeof PLATFORMS)[number]>;
    }> = await ctx.runQuery(internal.automation._findTriggerableNews, {});
    for (const t of triggers) {
      const news: Doc<"news"> | null = await ctx.runQuery(
        internal.automation._getNews,
        { id: t.newsId }
      );
      if (!news) continue;
      const prompt = `${news.title}. ${news.summary}`.slice(0, 500);
      const jobId: Id<"automationJobs"> = await ctx.runMutation(
        internal.automation._createJob,
        { newsId: t.newsId, platforms: t.platforms, prompt }
      );
      await ctx.scheduler.runAfter(
        0,
        internal.automationActions.runOrchestrator,
        { jobId }
      );
    }
    return triggers.length;
  },
});
