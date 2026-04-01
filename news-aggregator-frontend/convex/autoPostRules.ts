import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("autoPostRules").collect();
  },
});

export const toggleRule = mutation({
  args: { id: v.id("autoPostRules") },
  handler: async (ctx, args) => {
    const rule = await ctx.db.get(args.id);
    if (rule) {
      await ctx.db.patch(args.id, { enabled: !rule.enabled });
    }
  },
});

export const updateThreshold = mutation({
  args: {
    id: v.id("autoPostRules"),
    threshold: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { threshold: args.threshold });
  },
});
