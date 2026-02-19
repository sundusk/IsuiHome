import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const HEARTBEAT_PATH = "/Users/sundusk/.openclaw/workspace/HEARTBEAT.md";
const SOURCE = "HEARTBEAT.md";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

type ParsedTask = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  dueDate?: string;
};

const SECTION_STATUS_MAP: Array<{ matcher: RegExp; status: TaskStatus }> = [
  { matcher: /^##\s+⏳\s*进行中/i, status: "in_progress" },
  { matcher: /^##\s+🚨\s*待处理\/异常/i, status: "todo" },
  { matcher: /^##\s+✅\s*最近完成/i, status: "done" }
];

function normalizePriority(input?: string): TaskPriority {
  if (!input) return "medium";
  const value = input.trim().toLowerCase();
  if (["high", "h", "p0", "p1", "urgent", "critical", "高", "紧急"].some((k) => value.includes(k))) {
    return "high";
  }
  if (["low", "l", "p3", "p4", "低"].some((k) => value.includes(k))) {
    return "low";
  }
  return "medium";
}

function extractOwner(line: string): string {
  const ownerPatterns = [
    /(?:owner|负责人|执行人)\s*[:：]\s*([^,，)）]+)/i,
    /\b(?:by|owner)\s+([^,，)）]+)/i
  ];

  for (const pattern of ownerPatterns) {
    const match = line.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  if (line.includes("小哥")) return "Jarvis";
  return "MC";
}

function extractPriority(line: string): TaskPriority {
  const priorityPatterns = [
    /(?:priority|优先级)\s*[:：]\s*([^,，)）]+)/i,
    /\b(p[0-4])\b/i
  ];

  for (const pattern of priorityPatterns) {
    const match = line.match(pattern);
    if (match?.[1]) {
      return normalizePriority(match[1]);
    }
  }

  return "medium";
}

function extractDueDate(line: string): string | undefined {
  const duePattern = /(?:due|截止|到期)\s*[:：]\s*(\d{4}-\d{2}-\d{2})/i;
  const plainDatePattern = /(\d{4}-\d{2}-\d{2})/;

  const dueMatch = line.match(duePattern);
  if (dueMatch?.[1]) return dueMatch[1];

  const plainMatch = line.match(plainDatePattern);
  if (plainMatch?.[1]) return plainMatch[1];

  return undefined;
}

function cleanTitle(raw: string): string {
  let text = raw
    .replace(/^[-*]\s*\[[ xX]\]\s*/, "")
    .replace(/^\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?\s*[:：]\s*/, "")
    .trim();

  const bold = text.match(/\*\*([^*]+)\*\*/);
  if (bold?.[1]) {
    text = bold[1].trim();
  } else {
    text = text.split(/[：:]/)[0]?.trim() ?? text;
  }

  text = text
    .replace(/^[^\p{Script=Han}\p{L}\p{N}]+/u, "")
    .trim();

  return text;
}

function parseTasks(markdown: string): ParsedTask[] {
  const lines = markdown.split(/\r?\n/);
  const tasks: ParsedTask[] = [];

  let currentStatus: TaskStatus | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const found = SECTION_STATUS_MAP.find((s) => s.matcher.test(line.trim()));
      currentStatus = found ? found.status : null;
      continue;
    }

    if (!currentStatus || !/^[-*]\s+\[[ xX]\]/.test(line)) {
      continue;
    }

    const title = cleanTitle(line);
    if (!title) continue;

    tasks.push({
      title,
      status: currentStatus,
      priority: extractPriority(line),
      owner: extractOwner(line),
      dueDate: extractDueDate(line)
    });
  }

  return tasks;
}

function runConvex(functionPath: string, args: Record<string, unknown>) {
  execFileSync("npx", ["convex", "run", functionPath, JSON.stringify(args)], {
    stdio: "inherit"
  });
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const markdown = readFileSync(HEARTBEAT_PATH, "utf8");
  const tasks = parseTasks(markdown);

  if (tasks.length === 0) {
    throw new Error("No tasks parsed from heartbeat file. Check section headers and task list format.");
  }

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, count: tasks.length, tasks }, null, 2));
    return;
  }

  for (const task of tasks) {
    runConvex("tasks:upsert", {
      title: task.title,
      status: task.status,
      priority: task.priority,
      owner: task.owner,
      dueDate: task.dueDate,
      source: SOURCE
    });
  }

  runConvex("tasks:archiveMissingFromSource", {
    source: SOURCE,
    activeTitles: tasks
      .filter((task) => task.status === "todo" || task.status === "in_progress")
      .map((task) => task.title)
  });

  console.log(`Synced ${tasks.length} task(s) from ${HEARTBEAT_PATH}.`);
}

main();
