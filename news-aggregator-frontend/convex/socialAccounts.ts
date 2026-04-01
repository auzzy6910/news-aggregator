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
