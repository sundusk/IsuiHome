"use client";

import { useQuery } from "convex/react";
import { AGENTS } from "@/lib/constants";
import { type Language } from "@/lib/i18n";

type Agent = {
  code: string;
  role: string;
  description: string;
  status: string;
};

const statusLabels: Record<string, string> = {
  active: "在线",
  idle: "空闲",
  offline: "离线",
  busy: "忙碌",
  online: "在线",
  monitoring: "监控中"
};

const copy = {
  title: "代理团队",
  subtitle: "IsuiHome 代理团队；下列成员负责执行任务与系统协同。"
};

function TeamPanel({ agents, language }: { agents: Agent[]; language: Language }) {
  void language;
  const t = copy;

  return (
    <section className="frost rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <h2 className="mb-4 text-xl font-semibold text-ice-800">{t.title}</h2>
      <p className="mb-4 text-sm text-ice-600">{t.subtitle}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <article key={agent.code} className="rounded-xl border border-ice-100 bg-white/85 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ice-900">{agent.code}</h3>
              <span className="rounded-full bg-ice-100 px-2 py-1 text-xs font-medium text-ice-700">
                {statusLabels[agent.status.toLowerCase()] ?? agent.status}
              </span>
            </div>
            <p className="text-sm font-medium text-ice-700">{agent.role}</p>
            <p className="mt-2 text-sm text-ice-600">{agent.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamOnline({ language }: { language: Language }) {
  const agents = (useQuery("agents:list" as never) as Agent[] | undefined) ?? [...AGENTS];
  return <TeamPanel agents={agents} language={language} />;
}

export function TeamView({ language }: { language: Language }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <TeamPanel agents={[...AGENTS]} language={language} />;
  }

  return <TeamOnline language={language} />;
}
