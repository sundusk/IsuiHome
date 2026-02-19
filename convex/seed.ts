import { mutation } from "./_generated/server";

export const seedMissionControl = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("tasks", {
      title: "Establish Convex schema for mission tables",
      status: "in_progress",
      priority: "high",
      owner: "Jarvis",
      dueDate: "2026-02-20",
      source: "HEARTBEAT.md"
    });

    await ctx.db.insert("cronJobs", {
      name: "Daily Heartbeat Digest",
      schedule: "0 8 * * *",
      timezone: "America/Los_Angeles",
      nextRun: "2026-02-20T08:00:00-08:00",
      owner: "Isui"
    });

    await ctx.db.insert("memories", {
      title: "Mission briefing approved",
      type: "memory",
      tags: ["mission-control", "planning"],
      content: "Core surfaces locked: Tasks Board, Calendar, Memory, and Team.",
      createdAt: new Date().toISOString()
    });

    await ctx.db.insert("agents", {
      code: "Isui",
      role: "AI Home Orchestrator",
      description: "Coordinates routines and home state.",
      status: "Online"
    });
  }
});
