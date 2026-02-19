"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { MEMORY_FALLBACK } from "@/lib/constants";
import { getDateLocale, type Language } from "@/lib/i18n";

type Memory = {
  title: string;
  type: "memory" | "log";
  tags: string[];
  content: string;
  createdAt: string;
};

const typeLabels: Record<Language, Record<Memory["type"], string>> = {
  zh: {
    memory: "记忆",
    log: "日志"
  },
  en: {
    memory: "Memory",
    log: "Log"
  }
};

const copy = {
  zh: {
    title: "记忆库",
    placeholder: "搜索记忆与日志"
  },
  en: {
    title: "Memory Vault",
    placeholder: "Search memory and logs"
  }
} satisfies Record<Language, { title: string; placeholder: string }>;

const memoryFallback = MEMORY_FALLBACK as Memory[];

function MemoryPanel({ source, language }: { source: Memory[]; language: Language }) {
  const [search, setSearch] = useState("");
  const t = copy[language];
  const dateLocale = getDateLocale(language);

  const rows = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      return source;
    }
    return source.filter((entry) => {
      const blob = `${entry.title} ${entry.content} ${entry.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [search, source]);

  return (
    <section className="frost rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ice-800">{t.title}</h2>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.placeholder}
          className="w-full max-w-xs rounded-lg border border-ice-200 bg-white px-3 py-2 text-sm text-ice-900 outline-none ring-ice-300 placeholder:text-ice-400 focus:ring-2"
        />
      </div>
      <div className="space-y-3">
        {rows.map((entry) => (
          <article key={`${entry.title}-${entry.createdAt}`} className="rounded-xl border border-ice-100 bg-white/85 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-ice-900">{entry.title}</h3>
              <span className="rounded bg-ice-50 px-2 py-1 text-xs font-medium text-ice-700">{typeLabels[language][entry.type]}</span>
            </div>
            <p className="text-sm text-ice-700">{entry.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-ice-100 px-2 py-1 text-xs text-ice-700">#{tag}</span>
              ))}
              <span className="ml-auto text-xs text-ice-500">{new Date(entry.createdAt).toLocaleString(dateLocale)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MemoryViewOnline({ language }: { language: Language }) {
  const source = (useQuery("memories:list" as never) as Memory[] | undefined) ?? memoryFallback;
  return <MemoryPanel source={source} language={language} />;
}

export function MemoryView({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <MemoryPanel source={memoryFallback} language={language} />;
  }

  return <MemoryViewOnline language={language} />;
}
