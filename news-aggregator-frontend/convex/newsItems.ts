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
        .query("newsItems")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform!))
        .collect();
    } else {
      items = await ctx.db.query("newsItems").collect();
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
      .query("newsItems")
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

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newsItems", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("newsItems"),
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
