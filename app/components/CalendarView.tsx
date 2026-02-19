"use client";

import { useQuery } from "convex/react";
import { CRON_FALLBACK, HEARTBEAT_FALLBACK } from "@/lib/constants";

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

function CalendarPanel({ cron, tasks }: { cron: CronJob[]; tasks: Task[] }) {
  return (
    <section className="frost rounded-2xl p-5 shadow-frost">
      <h2 className="mb-4 text-xl font-semibold text-ice-800">Calendar</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-ice-100 bg-white/85 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ice-700">Scheduled Cron Jobs</h3>
          <ul className="space-y-3">
            {cron.map((job) => (
              <li key={job.name} className="rounded-lg border border-ice-100 bg-white p-3 text-sm">
                <p className="font-semibold text-ice-900">{job.name}</p>
                <p className="text-ice-700">{job.schedule} ({job.timezone})</p>
                <p className="text-ice-600">Next: {new Date(job.nextRun).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-ice-100 bg-white/85 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ice-700">Upcoming Tasks (14 days)</h3>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={`${task.title}-${task.dueDate}`} className="rounded-lg border border-ice-100 bg-white p-3 text-sm">
                <p className="font-semibold text-ice-900">{task.title}</p>
                <p className="text-ice-700">Owner: {task.owner}</p>
                <p className="text-ice-600">Due: {task.dueDate}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CalendarViewOnline() {
  const cron = (useQuery("cron:list" as never) as CronJob[] | undefined) ?? CRON_FALLBACK;
  const tasks = (useQuery("tasks:listUpcoming" as never, { days: 14 } as never) as Task[] | undefined) ?? HEARTBEAT_FALLBACK;

  return <CalendarPanel cron={cron} tasks={tasks} />;
}

export function CalendarView() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <CalendarPanel cron={CRON_FALLBACK} tasks={HEARTBEAT_FALLBACK} />;
  }

  return <CalendarViewOnline />;
}
