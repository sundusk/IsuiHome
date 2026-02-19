import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function normalizeTaskOwner(owner: string) {
  return owner === "小哥" ? "Jarvis" : owner;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("tasks").collect();
    return rows.map((task) => ({ ...task, owner: normalizeTaskOwner(task.owner) }));
  }
});

export const listUpcoming = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + args.days);
    const rows = await ctx.db.query("tasks").collect();
    return rows
      .filter((task) => {
        const due = new Date(task.dueDate);
        return due >= now && due <= end;
      })
      .map((task) => ({ ...task, owner: normalizeTaskOwner(task.owner) }));
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    owner: v.string(),
    dueDate: v.string(),
    source: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", { ...args, owner: normalizeTaskOwner(args.owner) });
  }
});
