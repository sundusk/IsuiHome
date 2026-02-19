"use client";

import { useQuery } from "convex/react";
import { CRON_FALLBACK, HEARTBEAT_FALLBACK } from "@/lib/constants";
import { getDateLocale, type Language } from "@/lib/i18n";

type CronJob = {
  name: string;
  schedule: string;
  timezone: string;
  nextRun: string;
  owner: string;
};

type Task = {
  title: string;
  dueDate: string;
  owner: string;
};

const copy = {
  title: "未来的计划安排",
  cronTitle: "自动提醒",
  upcomingTitle: "近期任务（14 天）",
  nextRun: "下次运行",
  owner: "负责人",
  due: "截止",
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

const cronFallback = CRON_FALLBACK as CronJob[];
const heartbeatFallback = HEARTBEAT_FALLBACK as Task[];

function CalendarPanel({ cron, tasks, language }: { cron: CronJob[]; tasks: Task[]; language: Language }) {
  const t = copy;
  const dateLocale = getDateLocale(language);

  return (
    <section className="frost rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <h2 className="mb-4 text-xl font-semibold text-ice-800">{t.title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-ice-100 bg-white/85 p-4">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-ice-700">{t.cronTitle}</h3>
          <ul className="space-y-3">
            {cron.map((job) => (
              <li key={job.name} className="rounded-lg border border-ice-100 bg-white p-3 text-sm">
                <p className="font-semibold text-ice-900">{job.name}</p>
                <p className="text-ice-700">{t.schedule}: {formatCronSchedule(job.schedule)}（{job.timezone}）</p>
                <p className="text-ice-600">{t.nextRun}: {new Date(job.nextRun).toLocaleString(dateLocale)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-ice-100 bg-white/85 p-4">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-ice-700">{t.upcomingTitle}</h3>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={`${task.title}-${task.dueDate}`} className="rounded-lg border border-ice-100 bg-white p-3 text-sm">
                <p className="font-semibold text-ice-900">{task.title}</p>
                <p className="text-ice-700">{t.owner}: {task.owner}</p>
                <p className="text-ice-600">{t.due}: {task.dueDate}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CalendarViewOnline({ language }: { language: Language }) {
  const cron = (useQuery("cron:list" as never) as CronJob[] | undefined) ?? cronFallback;
  const tasks = (useQuery("tasks:listUpcoming" as never, { days: 14 } as never) as Task[] | undefined) ?? heartbeatFallback;

  return <CalendarPanel cron={cron} tasks={tasks} language={language} />;
}

export function CalendarView({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <CalendarPanel cron={cronFallback} tasks={heartbeatFallback} language={language} />;
  }

  return <CalendarViewOnline language={language} />;
}
