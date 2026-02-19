import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memories").order("desc").collect();
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("memory"), v.literal("log")),
    tags: v.array(v.string()),
    content: v.string(),
    createdAt: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", args);
  }
});
