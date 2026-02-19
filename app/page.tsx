"use client";

import { useEffect, useState } from "react";
import { TaskBoard } from "./components/TaskBoard";
import { CalendarView } from "./components/CalendarView";
import { MemoryView } from "./components/MemoryView";
import { TeamView } from "./components/TeamView";
import { DEFAULT_LANGUAGE, isLanguage, LANGUAGE_STORAGE_KEY, type Language } from "@/lib/i18n";

const copy = {
  zh: {
    title: "任务指挥中心",
    description: "面向任务、自动化、记忆与智能体角色的统一工作台。基于 Next.js、Tailwind CSS 与 Convex 实时数据能力构建。"
  },
  en: {
    title: "Mission Control Center",
    description: "A unified workspace for tasks, automation, memory, and AI agent roles, powered by Next.js, Tailwind CSS, and Convex real-time data."
  }
} satisfies Record<Language, { title: string; description: string }>;

export default function HomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = copy[language];

  return (
    <main className="mx-auto max-w-7xl p-4 pb-10 transition-colors duration-300 md:p-8">
      <header className="mb-6 rounded-2xl frost p-6 shadow-frost transition-colors duration-300">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice-600">IsuiHome</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-ice-900 transition-colors duration-300 md:text-4xl">{t.title}</h1>
          <button
            type="button"
            onClick={() => setLanguage((prev) => (prev === "zh" ? "en" : "zh"))}
            className="rounded-full border border-ice-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-ice-700 transition-all duration-300 hover:bg-white hover:text-ice-900"
            aria-label={language === "zh" ? "Switch language to English" : "切换为中文"}
          >
            🌐 中/EN
          </button>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ice-700 transition-colors duration-300">{t.description}</p>
      </header>

      <div className="grid gap-5">
        <TaskBoard language={language} />
        <CalendarView language={language} />
        <MemoryView language={language} />
        <TeamView language={language} />
      </div>
    </main>
  );
}
