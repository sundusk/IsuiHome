import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    owner: v.string(),
    dueDate: v.string(),
    source: v.string()
  })
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"]),

  cronJobs: defineTable({
    name: v.string(),
    schedule: v.string(),
    timezone: v.string(),
    nextRun: v.string(),
    owner: v.string()
  }).index("by_nextRun", ["nextRun"]),

  memories: defineTable({
    title: v.string(),
    type: v.union(v.literal("memory"), v.literal("log")),
    tags: v.array(v.string()),
    content: v.string(),
    createdAt: v.string()
  }).index("by_createdAt", ["createdAt"]),

  agents: defineTable({
    code: v.string(),
    role: v.string(),
    description: v.string(),
    status: v.string()
  })
});
