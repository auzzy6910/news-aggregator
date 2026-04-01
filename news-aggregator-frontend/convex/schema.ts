import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  newsItems: defineTable({
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
    .index("by_trendScore", ["trendScore"]),

  trendData: defineTable({
    time: v.string(),
    twitter: v.number(),
    tiktok: v.number(),
    instagram: v.number(),
    facebook: v.number(),
    reddit: v.number(),
  }),

  locationNodes: defineTable({
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
});
