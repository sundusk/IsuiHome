import { query } from "./_generated/server";
import { v } from "convex/values";

function mergeUniqueById<T extends { _id: unknown }>(...groups: T[][]): T[] {
  const rows = new Map<string, T>();
  for (const group of groups) {
    for (const row of group) {
      rows.set(String(row._id), row);
    }
  }
  return [...rows.values()];
}

export const global = query({
  args: {
    q: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const text = args.q.trim();
    const limit = Math.min(Math.max(args.limit ?? 6, 1), 20);

    if (!text) {
      return {
        tasks: [],
        memories: [],
        cronJobs: [],
        total: 0
      };
    }

    const [taskTitle, taskOwner, taskSource, memoryTitle, memoryContent, cronName, cronSchedule, cronOwner] = await Promise.all([
      ctx.db.query("tasks").withSearchIndex("search_title", (q) => q.search("title", text)).take(limit),
      ctx.db.query("tasks").withSearchIndex("search_owner", (q) => q.search("owner", text)).take(limit),
      ctx.db.query("tasks").withSearchIndex("search_source", (q) => q.search("source", text)).take(limit),
      ctx.db.query("memories").withSearchIndex("search_title", (q) => q.search("title", text)).take(limit),
      ctx.db.query("memories").withSearchIndex("search_content", (q) => q.search("content", text)).take(limit),
      ctx.db.query("cronJobs").withSearchIndex("search_name", (q) => q.search("name", text)).take(limit),
      ctx.db.query("cronJobs").withSearchIndex("search_schedule", (q) => q.search("schedule", text)).take(limit),
      ctx.db.query("cronJobs").withSearchIndex("search_owner", (q) => q.search("owner", text)).take(limit)
    ]);

    const tasks = mergeUniqueById(taskTitle, taskOwner, taskSource).slice(0, limit);
    const memories = mergeUniqueById(memoryTitle, memoryContent).slice(0, limit);
    const cronJobs = mergeUniqueById(cronName, cronSchedule, cronOwner).slice(0, limit);

    return {
      tasks,
      memories,
      cronJobs,
      total: tasks.length + memories.length + cronJobs.length
    };
  }
});
