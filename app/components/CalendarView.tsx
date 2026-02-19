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
  zh: {
    title: "日程视图",
    cronTitle: "计划中的 Cron 任务",
    upcomingTitle: "近期任务（14 天）",
    nextRun: "下次运行",
    owner: "负责人",
    due: "截止"
  },
  en: {
    title: "Calendar View",
    cronTitle: "Scheduled Cron Jobs",
    upcomingTitle: "Upcoming Tasks (14 days)",
    nextRun: "Next run",
    owner: "Owner",
    due: "Due"
  }
} satisfies Record<
  Language,
  { title: string; cronTitle: string; upcomingTitle: string; nextRun: string; owner: string; due: string }
>;

function CalendarPanel({ cron, tasks, language }: { cron: CronJob[]; tasks: Task[]; language: Language }) {
  const t = copy[language];
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
                <p className="text-ice-700">{job.schedule} ({job.timezone})</p>
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
  const cron = (useQuery("cron:list" as never) as CronJob[] | undefined) ?? CRON_FALLBACK;
  const tasks = (useQuery("tasks:listUpcoming" as never, { days: 14 } as never) as Task[] | undefined) ?? HEARTBEAT_FALLBACK;

  return <CalendarPanel cron={cron} tasks={tasks} language={language} />;
}

export function CalendarView({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <CalendarPanel cron={CRON_FALLBACK} tasks={HEARTBEAT_FALLBACK} language={language} />;
  }

  return <CalendarViewOnline language={language} />;
}
