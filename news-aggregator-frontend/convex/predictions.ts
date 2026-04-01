import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("predictions").collect();
    return items.map((item) => ({ ...item, id: item._id }));
  },
});
