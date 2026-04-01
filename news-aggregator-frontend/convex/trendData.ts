import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("trendData").collect();
  },
});

export const create = mutation({
  args: {
    time: v.string(),
    twitter: v.number(),
    tiktok: v.number(),
    instagram: v.number(),
    facebook: v.number(),
    reddit: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trendData", args);
  },
});
