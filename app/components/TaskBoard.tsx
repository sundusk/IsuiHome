"use client";

import { useQuery } from "convex/react";
import { HEARTBEAT_FALLBACK } from "@/lib/constants";

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

function Board({ tasks }: { tasks: Task[] }) {
  return (
    <section className="frost rounded-2xl p-5 shadow-frost">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ice-800">Tasks Board</h2>
        <span className="rounded-full bg-ice-100 px-3 py-1 text-xs font-medium text-ice-700">
          Source: HEARTBEAT.md
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane} className="rounded-xl border border-ice-100 bg-white/80 p-3">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ice-700">
              {lane.replace("_", " ")}
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === lane)
                .map((task) => (
                  <article key={`${task.title}-${task.dueDate}`} className="rounded-lg border border-ice-100 bg-white p-3">
                    <p className="font-medium text-ice-900">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-ice-700">
                      <span className="rounded bg-ice-50 px-2 py-1">Owner: {task.owner}</span>
                      <span className="rounded bg-ice-50 px-2 py-1">Priority: {task.priority}</span>
                      <span className="rounded bg-ice-50 px-2 py-1">Due: {task.dueDate}</span>
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

function TaskBoardOnline() {
  const tasks = (useQuery("tasks:list" as never) as Task[] | undefined) ?? HEARTBEAT_FALLBACK;
  return <Board tasks={tasks} />;
}

export function TaskBoard() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <Board tasks={HEARTBEAT_FALLBACK} />;
  }

  return <TaskBoardOnline />;
}
