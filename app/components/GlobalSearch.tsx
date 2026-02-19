"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { CRON_FALLBACK, HEARTBEAT_FALLBACK, MEMORY_FALLBACK } from "@/lib/constants";
import { type Language } from "@/lib/i18n";

type Task = {
  _id?: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  owner: string;
  dueDate: string;
  source: string;
};

type Memory = {
  _id?: string;
  title: string;
  type: "memory" | "log";
  tags: string[];
  content: string;
  createdAt: string;
};

type CronJob = {
  _id?: string;
  name: string;
  schedule: string;
  timezone: string;
  nextRun: string;
  owner: string;
};

type SearchResult = {
  tasks: Task[];
  memories: Memory[];
  cronJobs: CronJob[];
  total: number;
};

const EMPTY_RESULT: SearchResult = { tasks: [], memories: [], cronJobs: [], total: 0 };

const copy = {
  title: "全局搜索",
  placeholder: "搜索任务、记忆、自动提醒（⌘K）",
  hint: "支持跨任务 / 记忆 / 自动提醒搜索",
  searching: "搜索中...",
  empty: "没有匹配结果",
  start: "输入关键词开始搜索",
  tasks: "任务",
  memories: "记忆",
  cron: "自动提醒",
  owner: "负责人",
  due: "截止",
  nextRun: "下次运行",
  schedule: "执行频率"
};

function formatCronSchedule(schedule: string): string {
  if (schedule === "0 8 * * *") {
    return "每天早上 8:00";
  }
  if (schedule === "0 */6 * * *") {
    return "每 6 小时一次";
  }
  if (schedule === "30 9 * * 1") {
    return "每周一上午 9:30";
  }
  return "按计划自动运行";
}

function useDebouncedValue(value: string, delayMs = 120) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function SearchPanel({
  language,
  query,
  setQuery,
  data,
  isLoading
}: {
  language: Language;
  query: string;
  setQuery: (value: string) => void;
  data: SearchResult;
  isLoading: boolean;
}) {
  void language;
  const t = copy;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isFocusShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isFocusShortcut) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const items = useMemo(
    () => [
      ...data.tasks.map((task) => (
        <article key={`task-${task._id ?? `${task.title}-${task.dueDate}`}`} className="rounded-lg border border-ice-100 bg-white p-3">
          <p className="font-medium text-ice-900">{task.title}</p>
          <p className="mt-1 text-xs text-ice-600">{t.owner}: {task.owner} · {t.due}: {task.dueDate}</p>
        </article>
      )),
      ...data.memories.map((memory) => (
        <article key={`memory-${memory._id ?? `${memory.title}-${memory.createdAt}`}`} className="rounded-lg border border-ice-100 bg-white p-3">
          <p className="font-medium text-ice-900">{memory.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-ice-600">{memory.content}</p>
        </article>
      )),
      ...data.cronJobs.map((job) => (
        <article key={`cron-${job._id ?? `${job.name}-${job.nextRun}`}`} className="rounded-lg border border-ice-100 bg-white p-3">
          <p className="font-medium text-ice-900">{job.name}</p>
          <p className="mt-1 text-xs text-ice-600">{t.schedule}: {formatCronSchedule(job.schedule)} · {t.nextRun}: {job.nextRun}</p>
        </article>
      ))
    ],
    [data.cronJobs, data.memories, data.tasks, t.due, t.nextRun, t.owner, t.schedule]
  );

  return (
    <section className="frost rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ice-800">{t.title}</h2>
        <span className="rounded-full bg-ice-100 px-3 py-1 text-xs font-medium text-ice-700">⌘K</span>
      </div>

      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.placeholder}
        className="w-full rounded-xl border border-ice-200 bg-white/95 px-4 py-3 text-sm text-ice-900 outline-none ring-ice-300 placeholder:text-ice-500 transition-all duration-150 focus:ring-2"
      />

      <p className="mt-2 text-xs text-ice-600">{t.hint}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-ice-100 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ice-600">{t.tasks}</p>
          <p className="mt-1 text-lg font-semibold text-ice-900">{data.tasks.length}</p>
        </div>
        <div className="rounded-xl border border-ice-100 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ice-600">{t.memories}</p>
          <p className="mt-1 text-lg font-semibold text-ice-900">{data.memories.length}</p>
        </div>
        <div className="rounded-xl border border-ice-100 bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ice-600">{t.cron}</p>
          <p className="mt-1 text-lg font-semibold text-ice-900">{data.cronJobs.length}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {!hasQuery && <p className="text-sm text-ice-600">{t.start}</p>}
        {hasQuery && isLoading && <p className="text-sm text-ice-600">{t.searching}</p>}
        {hasQuery && !isLoading && items.length === 0 && <p className="text-sm text-ice-600">{t.empty}</p>}
        {items}
      </div>
    </section>
  );
}

function GlobalSearchOnline({ language }: { language: Language }) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query);

  const data =
    (useQuery("search:global" as never, { q: debounced, limit: 5 } as never) as SearchResult | undefined) ?? EMPTY_RESULT;

  const isLoading = debounced.trim().length > 0 && query !== debounced;
  return <SearchPanel language={language} query={query} setQuery={setQuery} data={data} isLoading={isLoading} />;
}

function GlobalSearchOffline({ language }: { language: Language }) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query);

  const data = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) {
      return EMPTY_RESULT;
    }

    const tasks = HEARTBEAT_FALLBACK.filter((task) => {
      const blob = `${task.title} ${task.owner} ${task.source} ${task.dueDate}`.toLowerCase();
      return blob.includes(q);
    }).slice(0, 5) as Task[];

    const memories = MEMORY_FALLBACK.filter((entry) => {
      const blob = `${entry.title} ${entry.content} ${entry.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    }).slice(0, 5) as Memory[];

    const cronJobs = CRON_FALLBACK.filter((job) => {
      const blob = `${job.name} ${job.schedule} ${job.timezone} ${job.owner}`.toLowerCase();
      return blob.includes(q);
    }).slice(0, 5) as CronJob[];

    return {
      tasks,
      memories,
      cronJobs,
      total: tasks.length + memories.length + cronJobs.length
    };
  }, [debounced]);

  const isLoading = debounced.trim().length > 0 && query !== debounced;
  return <SearchPanel language={language} query={query} setQuery={setQuery} data={data} isLoading={isLoading} />;
}

export function GlobalSearch({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <GlobalSearchOffline language={language} />;
  }

  return <GlobalSearchOnline language={language} />;
}
