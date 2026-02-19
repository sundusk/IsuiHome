import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  }
});

export const upsert = mutation({
  args: {
    code: v.string(),
    role: v.string(),
    description: v.string(),
    status: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("code"), args.code))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: args.role,
        description: args.description,
        status: args.status
      });
      return existing._id;
    }

    return await ctx.db.insert("agents", args);
  }
});
