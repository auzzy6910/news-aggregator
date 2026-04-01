import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const allLocations = await ctx.db.query("locations").collect();

    // Build the tree structure
    const countries = allLocations.filter((loc) => loc.type === "country");

    return countries.map((country) => ({
      name: country.name,
      code: country.code,
      type: country.type,
      children: allLocations
        .filter((loc) => loc.parentCode === country.code)
        .map((child) => ({
          name: child.name,
          code: child.code,
          type: child.type,
        })),
    }));
  },
});
