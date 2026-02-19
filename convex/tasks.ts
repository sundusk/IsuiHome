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
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"), v.literal("archived")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    owner: v.string(),
    dueDate: v.string(),
    source: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", { ...args, owner: normalizeTaskOwner(args.owner) });
  }
});

export const upsert = mutation({
  args: {
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"), v.literal("archived")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    owner: v.string(),
    source: v.string(),
    dueDate: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const owner = normalizeTaskOwner(args.owner);
    const dueDate = args.dueDate ?? new Date().toISOString().slice(0, 10);
    const rows = await ctx.db.query("tasks").collect();
    const existing = rows.find((task) => task.title === args.title && task.source === args.source);

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, owner, dueDate });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("tasks", { ...args, owner, dueDate });
    return { action: "created", id };
  }
});

export const archiveMissingFromSource = mutation({
  args: {
    source: v.string(),
    activeTitles: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("tasks").collect();
    const activeTitleSet = new Set(args.activeTitles);
    let archivedCount = 0;

    for (const task of rows) {
      const shouldArchive =
        task.source === args.source &&
        (task.status === "todo" || task.status === "in_progress") &&
        !activeTitleSet.has(task.title);
      if (!shouldArchive) continue;
      archivedCount += 1;
      await ctx.db.patch(task._id, { status: "archived" });
    }

    return { archivedCount };
  }
});
