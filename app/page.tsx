"use client";

import { TaskBoard } from "./components/TaskBoard";
import { CalendarView } from "./components/CalendarView";
import { MemoryView } from "./components/MemoryView";
import { TeamView } from "./components/TeamView";
import { GlobalSearch } from "./components/GlobalSearch";
import { type Language } from "@/lib/i18n";

const copy = {
  title: "任务指挥中心",
  description: "IsuiHome: 数字化任务指挥与监控中心。Isui、Jarvis、MC 作为执行代理协同处理任务推进、自动提醒与记忆整理。"
};

export default function HomePage() {
  const language: Language = "zh";

  const t = copy;

  return (
    <main className="mx-auto max-w-7xl p-4 pb-10 transition-colors duration-300 md:p-8">
      <header className="mb-6 rounded-2xl frost p-6 shadow-frost transition-colors duration-300">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice-600">IsuiHome</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-ice-900 transition-colors duration-300 md:text-4xl">{t.title}</h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ice-700 transition-colors duration-300">{t.description}</p>
      </header>

      <div className="grid gap-5">
        <GlobalSearch language={language} />
        <TaskBoard language={language} />
        <CalendarView language={language} />
        <MemoryView language={language} />
        <TeamView language={language} />
      </div>
    </main>
  );
}
