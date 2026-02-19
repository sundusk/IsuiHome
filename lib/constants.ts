export const AGENTS = [
  {
    code: "Isui",
    role: "AI Home Orchestrator",
    description: "Coordinates routines, tracks home state, and guides daily priorities.",
    status: "Online"
  },
  {
    code: "Jarvis",
    role: "Automation Engineer",
    description: "Runs tooling, checks integrations, and keeps scheduled automations healthy.",
    status: "Monitoring"
  },
  {
    code: "MC",
    role: "Mission Control Core",
    description: "Supervises mission objectives, escalation paths, and system-level decisions.",
    status: "Active"
  }
] as const;

export const HEARTBEAT_FALLBACK = [
  {
    title: "Establish Convex schema for mission tables",
    status: "in_progress",
    priority: "high",
    owner: "Jarvis",
    dueDate: "2026-02-20",
    source: "HEARTBEAT.md"
  },
  {
    title: "Finalize IsuiHome dashboard layout",
    status: "todo",
    priority: "medium",
    owner: "Isui",
    dueDate: "2026-02-22",
    source: "HEARTBEAT.md"
  },
  {
    title: "Set memory search filters and tags",
    status: "todo",
    priority: "medium",
    owner: "MC",
    dueDate: "2026-02-23",
    source: "HEARTBEAT.md"
  },
  {
    title: "Ship Mission Control v1",
    status: "done",
    priority: "high",
    owner: "MC",
    dueDate: "2026-02-25",
    source: "HEARTBEAT.md"
  }
];

export const CRON_FALLBACK = [
  {
    name: "Daily Heartbeat Digest",
    schedule: "0 8 * * *",
    timezone: "America/Los_Angeles",
    nextRun: "2026-02-20T08:00:00-08:00",
    owner: "Isui"
  },
  {
    name: "Memory Compaction",
    schedule: "0 */6 * * *",
    timezone: "America/Los_Angeles",
    nextRun: "2026-02-19T18:00:00-08:00",
    owner: "Jarvis"
  },
  {
    name: "Agent Role Integrity Check",
    schedule: "30 9 * * 1",
    timezone: "America/Los_Angeles",
    nextRun: "2026-02-23T09:30:00-08:00",
    owner: "MC"
  }
];

export const MEMORY_FALLBACK = [
  {
    title: "Convex connection configured",
    type: "log",
    tags: ["convex", "setup"],
    content: "Environment variable NEXT_PUBLIC_CONVEX_URL prepared for production wiring.",
    createdAt: "2026-02-19T10:15:00-08:00"
  },
  {
    title: "Mission briefing approved",
    type: "memory",
    tags: ["mission-control", "planning"],
    content: "Core surfaces locked: Tasks Board, Calendar, Memory, and Team.",
    createdAt: "2026-02-19T10:30:00-08:00"
  },
  {
    title: "Heartbeat refresh",
    type: "log",
    tags: ["heartbeat", "ops"],
    content: "Pending task ownership redistributed between Isui and Jarvis.",
    createdAt: "2026-02-19T11:00:00-08:00"
  }
];
