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
    .index("by_dueDate", ["dueDate"])
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_owner", { searchField: "owner" })
    .searchIndex("search_source", { searchField: "source" }),

  cronJobs: defineTable({
    name: v.string(),
    schedule: v.string(),
    timezone: v.string(),
    nextRun: v.string(),
    owner: v.string()
  })
    .index("by_nextRun", ["nextRun"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_schedule", { searchField: "schedule" })
    .searchIndex("search_owner", { searchField: "owner" }),

  memories: defineTable({
    title: v.string(),
    type: v.union(v.literal("memory"), v.literal("log")),
    tags: v.array(v.string()),
    content: v.string(),
    createdAt: v.string()
  })
    .index("by_createdAt", ["createdAt"])
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_content", { searchField: "content" }),

  agents: defineTable({
    code: v.string(),
    role: v.string(),
    description: v.string(),
    status: v.string()
  })
});
