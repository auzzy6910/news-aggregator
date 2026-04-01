import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const nodes = await ctx.db.query("locationNodes").collect();

    // Build tree structure: countries with children
    const countries = nodes.filter((n) => n.type === "country");
    const children = nodes.filter((n) => n.type !== "country");

    return countries.map((country) => ({
      ...country,
      children: children
        .filter((c) => c.parentCode === country.code)
        .map((c) => ({
          name: c.name,
          code: c.code,
          type: c.type,
        })),
    }));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    type: v.union(
      v.literal("country"),
      v.literal("state"),
      v.literal("county")
    ),
    parentCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("locationNodes", args);
  },
});
