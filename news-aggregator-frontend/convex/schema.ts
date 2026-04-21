import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  news: defineTable({
    title: v.string(),
    summary: v.string(),
    aiDraft: v.string(),
    platform: v.union(
      v.literal("twitter"),
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("reddit"),
      v.literal("web")
    ),
    category: v.string(),
    imageUrl: v.string(),
    videoUrl: v.optional(v.string()),
    originalUrl: v.string(),
    author: v.string(),
    publishedAt: v.string(),
    locationCountry: v.string(),
    locationRegion: v.string(),
    metricsLikes: v.number(),
    metricsShares: v.number(),
    metricsComments: v.number(),
    metricsVelocity: v.number(),
    trendScore: v.number(),
    hashtags: v.array(v.string()),
    isAutoPostEnabled: v.boolean(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("trending")
    ),
  })
    .index("by_platform", ["platform"])
    .index("by_status", ["status"])
    .index("by_trendScore", ["trendScore"])
    .index("by_category", ["category"]),

  trendTimeline: defineTable({
    time: v.string(),
    twitter: v.number(),
    tiktok: v.number(),
    instagram: v.number(),
    facebook: v.number(),
    reddit: v.number(),
  }),

  locations: defineTable({
    name: v.string(),
    code: v.string(),
    type: v.union(
      v.literal("country"),
      v.literal("state"),
      v.literal("county")
    ),
    parentCode: v.optional(v.string()),
  }).index("by_parentCode", ["parentCode"]),

  socialAccounts: defineTable({
    platform: v.union(
      v.literal("twitter"),
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("reddit"),
      v.literal("web")
    ),
    handle: v.string(),
    avatar: v.string(),
    connected: v.boolean(),
    followers: v.number(),
  }),

  autoPostRules: defineTable({
    platform: v.union(
      v.literal("twitter"),
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("reddit"),
      v.literal("web")
    ),
    threshold: v.number(),
    enabled: v.boolean(),
    accounts: v.array(v.string()),
  }),

  predictions: defineTable({
    topic: v.string(),
    currentScore: v.number(),
    predictedPeak: v.number(),
    timeToTrend: v.string(),
    velocity: v.number(),
    platforms: v.array(
      v.union(
        v.literal("twitter"),
        v.literal("tiktok"),
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("reddit"),
        v.literal("web")
      )
    ),
    confidence: v.number(),
    dataPoints: v.array(
      v.object({
        time: v.string(),
        score: v.number(),
      })
    ),
  }),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  automationJobs: defineTable({
    newsId: v.id("news"),
    status: v.union(
      v.literal("pending"),
      v.literal("generating_video"),
      v.literal("combining_clips"),
      v.literal("posting"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    stage: v.union(
      v.literal("trigger"),
      v.literal("video"),
      v.literal("combine"),
      v.literal("post"),
      v.literal("done")
    ),
    videoProvider: v.optional(
      v.union(
        v.literal("runway"),
        v.literal("replicate"),
        v.literal("pika"),
        v.literal("stub")
      )
    ),
    prompt: v.optional(v.string()),
    clipUrls: v.optional(v.array(v.string())),
    finalVideoUrl: v.optional(v.string()),
    postPlatforms: v.optional(
      v.array(
        v.union(
          v.literal("twitter"),
          v.literal("tiktok"),
          v.literal("instagram"),
          v.literal("facebook"),
          v.literal("reddit")
        )
      )
    ),
    error: v.optional(v.string()),
    startedAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_newsId", ["newsId"])
    .index("by_startedAt", ["startedAt"]),

  videoClips: defineTable({
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
    createdAt: v.number(),
  }).index("by_jobId", ["jobId"]),

  autoPostLog: defineTable({
    jobId: v.id("automationJobs"),
    newsId: v.id("news"),
    platform: v.union(
      v.literal("twitter"),
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("reddit")
    ),
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
    postedAt: v.number(),
  })
    .index("by_jobId", ["jobId"])
    .index("by_newsId", ["newsId"])
    .index("by_platform", ["platform"]),
});
