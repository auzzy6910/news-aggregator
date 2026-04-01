import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rules = await ctx.db.query("autoPostRules").collect();
    return rules.map((r) => ({ ...r, id: r._id }));
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

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("autoPostRules", args);
  },
});
