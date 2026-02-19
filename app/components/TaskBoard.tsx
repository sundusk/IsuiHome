"use client";

import { useQuery } from "convex/react";
import { HEARTBEAT_FALLBACK } from "@/lib/constants";
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

const lanes: Task["status"][] = ["todo", "in_progress", "done"];
const laneLabels: Record<Task["status"], string> = {
  todo: "待办",
  in_progress: "进行中",
  done: "已完成"
};

const priorityLabels: Record<Task["priority"], string> = {
  low: "低",
  medium: "中",
  high: "高"
};

const copy = {
  title: "正在为你做的事",
  source: "来源",
  owner: "执行代理",
  priority: "优先级",
  due: "截止"
};

const heartbeatFallback = HEARTBEAT_FALLBACK as Task[];

function Board({ tasks, language }: { tasks: Task[]; language: Language }) {
  void language;
  const t = copy;
  return (
    <section className="frost rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ice-800">{t.title}</h2>
        <span className="rounded-full bg-ice-100 px-3 py-1 text-xs font-medium text-ice-700">
          {t.source}: HEARTBEAT.md
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane} className="rounded-xl border border-ice-100 bg-white/80 p-3">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-ice-700">{laneLabels[lane]}</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === lane)
                .map((task) => (
                  <article key={`${task.title}-${task.dueDate}`} className="rounded-lg border border-ice-100 bg-white p-3">
                    <p className="font-medium text-ice-900">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-ice-700">
                      <span className="rounded bg-ice-50 px-2 py-1">{t.owner}: {task.owner}</span>
                      <span className="rounded bg-ice-50 px-2 py-1">{t.priority}: {priorityLabels[task.priority]}</span>
                      <span className="rounded bg-ice-50 px-2 py-1">{t.due}: {task.dueDate}</span>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskBoardOnline({ language }: { language: Language }) {
  const tasks = (useQuery("tasks:list" as never) as Task[] | undefined) ?? heartbeatFallback;
  return <Board tasks={tasks} language={language} />;
}

export function TaskBoard({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <Board tasks={heartbeatFallback} language={language} />;
  }

  return <TaskBoardOnline language={language} />;
}
