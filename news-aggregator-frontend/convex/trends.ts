import { query } from "./_generated/server";

export const getTimeline = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("trendTimeline").collect();
  },
});
