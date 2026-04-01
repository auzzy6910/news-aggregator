import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    platform: v.optional(
      v.union(
        v.literal("twitter"),
        v.literal("tiktok"),
        v.literal("instagram"),
        v.literal("facebook"),
        v.literal("reddit"),
        v.literal("web"),
        v.literal("all")
      )
    ),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("news").collect();

    if (args.platform && args.platform !== "all") {
      items = items.filter((item) => item.platform === args.platform);
    }

    if (args.searchQuery) {
      const q = args.searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.hashtags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return items;
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("trending")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("news")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("news"),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("trending")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const toggleAutoPost = mutation({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.patch(args.id, {
        isAutoPostEnabled: !item.isAutoPostEnabled,
      });
    }
  },
});
