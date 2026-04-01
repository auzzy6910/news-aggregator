import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("predictions").collect();
    return items.map((item) => ({ ...item, id: item._id }));
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("predictions", args);
  },
});
