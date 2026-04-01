import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("socialAccounts").collect();
    return accounts.map((a) => ({ ...a, id: a._id }));
  },
});

export const toggleConnection = mutation({
  args: { id: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.id);
    if (account) {
      await ctx.db.patch(args.id, { connected: !account.connected });
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
    handle: v.string(),
    avatar: v.string(),
    connected: v.boolean(),
    followers: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("socialAccounts", args);
  },
});
