export const AGENTS = [
  {
    code: "Isui",
    role: "家庭节奏编排助手",
    description: "负责统筹每日安排，帮助你稳稳推进每一步。",
    status: "在线"
  },
  {
    code: "Jarvis",
    role: "自动化执行伙伴",
    description: "负责执行工具链、巡检流程，并保持系统稳定运行。",
    status: "监控中"
  },
  {
    code: "MC",
    role: "任务中枢",
    description: "负责把控整体目标、节奏和关键决策。",
    status: "在线"
  }
] as const;

export const HEARTBEAT_FALLBACK = [
  {
    title: "搭建 IsuiHome 的数字化地基",
    status: "in_progress",
    priority: "high",
    owner: "Jarvis",
    dueDate: "2026-02-20",
    source: "HEARTBEAT.md"
  },
  {
    title: "整理首页布局，让信息一眼就明白",
    status: "todo",
    priority: "medium",
    owner: "Isui",
    dueDate: "2026-02-22",
    source: "HEARTBEAT.md"
  },
  {
    title: "优化记忆检索标签，回顾更轻松",
    status: "todo",
    priority: "medium",
    owner: "MC",
    dueDate: "2026-02-23",
    source: "HEARTBEAT.md"
  },
  {
    title: "IsuiHome 第一版上线准备完成",
    status: "done",
    priority: "high",
    owner: "MC",
    dueDate: "2026-02-25",
    source: "HEARTBEAT.md"
  }
];

export const CRON_FALLBACK = [
  {
    name: "每日工作简报",
    schedule: "0 8 * * *",
    timezone: "Asia/Shanghai",
    nextRun: "2026-02-20T08:00:00+08:00",
    owner: "Isui"
  },
  {
    name: "记忆整理提醒",
    schedule: "0 */6 * * *",
    timezone: "Asia/Shanghai",
    nextRun: "2026-02-19T18:00:00+08:00",
    owner: "Jarvis"
  },
  {
    name: "每周角色状态巡检",
    schedule: "30 9 * * 1",
    timezone: "Asia/Shanghai",
    nextRun: "2026-02-23T09:30:00+08:00",
    owner: "MC"
  }
];

export const MEMORY_FALLBACK = [
  {
    title: "连接配置已就绪",
    type: "log",
    tags: ["convex", "setup"],
    content: "NEXT_PUBLIC_CONVEX_URL 已准备好，数据可实时同步。",
    createdAt: "2026-02-19T10:15:00+08:00"
  },
  {
    title: "项目启动：IsuiHome 核心规划确认",
    type: "memory",
    tags: ["mission-control", "planning"],
    content: "核心界面已确认：正在为你做的事、未来的计划安排、我们的共同记忆与团队视图。",
    createdAt: "2026-02-19T10:30:00+08:00"
  },
  {
    title: "任务协同更新",
    type: "log",
    tags: ["heartbeat", "ops"],
    content: "今日待办已重新分配，Isui 与 Jarvis 协作节奏更顺畅。",
    createdAt: "2026-02-19T11:00:00+08:00"
  }
];
