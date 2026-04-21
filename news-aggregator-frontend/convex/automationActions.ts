import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import {
  combineClips,
  generateClip,
  postToPlatform,
  SocialPlatform,
  SocialPostInput,
} from "./providers";

const CLIP_COUNT = 3;

type JobDoc = Doc<"automationJobs">;

/* -------------------------------------------------------------------------- */
/* Orchestrator                                                               */
/* -------------------------------------------------------------------------- */

export const runOrchestrator = internalAction({
  args: { jobId: v.id("automationJobs") },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job: JobDoc | null = await ctx.runQuery(
      internal.automation._getJob,
      { id: jobId }
    );
    if (!job) return;
    if (job.status === "cancelled") return;
    try {
      await ctx.runMutation(internal.automation._updateJob, {
        id: jobId,
        patch: { status: "generating_video", stage: "video" },
      });
      await ctx.runAction(internal.automationActions.generateVideoStage, {
        jobId,
      });
      await ctx.runMutation(internal.automation._updateJob, {
        id: jobId,
        patch: { status: "combining_clips", stage: "combine" },
      });
      await ctx.runAction(internal.automationActions.combineClipsStage, {
        jobId,
      });
      await ctx.runMutation(internal.automation._updateJob, {
        id: jobId,
        patch: { status: "posting", stage: "post" },
      });
      await ctx.runAction(internal.automationActions.autoPostStage, { jobId });
      await ctx.runMutation(internal.automation._updateJob, {
        id: jobId,
        patch: {
          status: "completed",
          stage: "done",
          completedAt: Date.now(),
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[automation] job ${jobId} failed:`, message);
      await ctx.runMutation(internal.automation._updateJob, {
        id: jobId,
        patch: {
          status: "failed",
          stage: "done",
          error: message,
          completedAt: Date.now(),
        },
      });
    }
  },
});

/* -------------------------------------------------------------------------- */
/* Stage 1 — generate video clips                                             */
/* -------------------------------------------------------------------------- */

export const generateVideoStage = internalAction({
  args: { jobId: v.id("automationJobs") },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job: JobDoc | null = await ctx.runQuery(
      internal.automation._getJob,
      { id: jobId }
    );
    if (!job || !job.prompt) throw new Error("Job missing prompt");
    const clipUrls: string[] = [];
    let provider: "runway" | "replicate" | "pika" | "stub" = "stub";
    for (let i = 0; i < CLIP_COUNT; i++) {
      const scenePrompt = `${job.prompt} — scene ${i + 1} of ${CLIP_COUNT}`;
      try {
        const clip = await generateClip(scenePrompt, i);
        provider = clip.provider;
        await ctx.runMutation(internal.automation._insertClip, {
          jobId,
          index: i,
          provider: clip.provider,
          externalId: clip.externalId,
          prompt: scenePrompt,
          clipUrl: clip.clipUrl,
          durationSec: clip.durationSec,
          status: "ready",
        });
        clipUrls.push(clip.clipUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await ctx.runMutation(internal.automation._insertClip, {
          jobId,
          index: i,
          provider: "stub",
          prompt: scenePrompt,
          status: "failed",
          error: message,
        });
      }
    }
    if (clipUrls.length === 0) throw new Error("No clips were generated");
    await ctx.runMutation(internal.automation._updateJob, {
      id: jobId,
      patch: { clipUrls, videoProvider: provider },
    });
  },
});

/* -------------------------------------------------------------------------- */
/* Stage 2 — combine clips                                                    */
/* -------------------------------------------------------------------------- */

export const combineClipsStage = internalAction({
  args: { jobId: v.id("automationJobs") },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job: JobDoc | null = await ctx.runQuery(
      internal.automation._getJob,
      { id: jobId }
    );
    if (!job) throw new Error("Job missing");
    const news: Doc<"news"> | null = await ctx.runQuery(
      internal.automation._getNews,
      { id: job.newsId }
    );
    const title = news?.title ?? "untitled";
    const combined = await combineClips(job.clipUrls ?? [], title);
    await ctx.runMutation(internal.automation._updateJob, {
      id: jobId,
      patch: { finalVideoUrl: combined.finalVideoUrl },
    });
  },
});

/* -------------------------------------------------------------------------- */
/* Stage 3 — auto-post to each platform                                       */
/* -------------------------------------------------------------------------- */

export const autoPostStage = internalAction({
  args: { jobId: v.id("automationJobs") },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job: JobDoc | null = await ctx.runQuery(
      internal.automation._getJob,
      { id: jobId }
    );
    if (!job) throw new Error("Job missing");
    const news: Doc<"news"> | null = await ctx.runQuery(
      internal.automation._getNews,
      { id: job.newsId }
    );
    if (!news) throw new Error("News missing");
    const platforms: SocialPlatform[] = (job.postPlatforms ??
      []) as SocialPlatform[];
    for (const platform of platforms) {
      const input: SocialPostInput = {
        platform,
        account: `@${platform}`,
        message: news.aiDraft || news.summary || news.title,
        videoUrl: job.finalVideoUrl,
        imageUrl: news.imageUrl,
        originalUrl: news.originalUrl,
        hashtags: news.hashtags,
      };
      const result = await postToPlatform(input);
      await ctx.runMutation(internal.automation._insertPostLog, {
        jobId,
        newsId: job.newsId,
        platform,
        account: input.account,
        status: result.success ? "success" : "failed",
        externalPostId: result.externalPostId,
        postUrl: result.postUrl,
        message: result.message ?? input.message,
        error: result.error,
      });
    }
    await ctx.runMutation(internal.automation._markNewsPosted, {
      id: job.newsId,
      videoUrl: job.finalVideoUrl,
    });
  },
});

/* -------------------------------------------------------------------------- */
/* Cron entrypoint                                                            */
/* -------------------------------------------------------------------------- */

export const scheduledTrigger = internalAction({
  args: {},
  handler: async (ctx): Promise<number> => {
    const triggers: Array<{
      newsId: Id<"news">;
      platforms: SocialPlatform[];
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
