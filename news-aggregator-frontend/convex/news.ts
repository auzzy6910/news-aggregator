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
        v.literal("web")
      )
    ),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items;
    if (args.platform) {
      items = await ctx.db
        .query("news")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform!))
        .collect();
    } else {
      items = await ctx.db.query("news").collect();
    }

    if (args.searchQuery) {
      const query = args.searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.hashtags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return items.map((item) => ({
      ...item,
      id: item._id,
      location: {
        country: item.locationCountry,
        region: item.locationRegion,
      },
      metrics: {
        likes: item.metricsLikes,
        shares: item.metricsShares,
        comments: item.metricsComments,
        velocity: item.metricsVelocity,
      },
    }));
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
    const items = await ctx.db
      .query("news")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    return items.map((item) => ({
      ...item,
      id: item._id,
      location: {
        country: item.locationCountry,
        region: item.locationRegion,
      },
      metrics: {
        likes: item.metricsLikes,
        shares: item.metricsShares,
        comments: item.metricsComments,
        velocity: item.metricsVelocity,
      },
    }));
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allNews = await ctx.db.query("news").collect();
    const trendingCount = allNews.filter((n) => n.status === "trending").length;
    const totalImpressions = allNews.reduce(
      (sum, n) => sum + n.metricsLikes + n.metricsShares + n.metricsComments,
      0
    );
    const autoPosted = allNews.filter((n) => n.isAutoPostEnabled && n.status === "posted").length;
    const avgVelocity =
      allNews.length > 0
        ? allNews.reduce((sum, n) => sum + n.metricsVelocity, 0) / allNews.length
        : 0;

    return {
      trendingCount,
      totalImpressions,
      autoPosted,
      avgVelocity: Math.round(avgVelocity * 10) / 10,
    };
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
      await ctx.db.patch(args.id, { isAutoPostEnabled: !item.isAutoPostEnabled });
    }
  },
});
