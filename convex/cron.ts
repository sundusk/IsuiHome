import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cronJobs").order("asc").collect();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    schedule: v.string(),
    timezone: v.string(),
    nextRun: v.string(),
    owner: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cronJobs", args);
  }
});
