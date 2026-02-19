"use client";

import { useQuery } from "convex/react";
import { AGENTS } from "@/lib/constants";

type Agent = {
  code: string;
  role: string;
  description: string;
  status: string;
};

function TeamPanel({ agents }: { agents: Agent[] }) {
  return (
    <section className="frost rounded-2xl p-5 shadow-frost">
      <h2 className="mb-4 text-xl font-semibold text-ice-800">Team</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <article key={agent.code} className="rounded-xl border border-ice-100 bg-white/85 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ice-900">{agent.code}</h3>
              <span className="rounded-full bg-ice-100 px-2 py-1 text-xs font-medium text-ice-700">{agent.status}</span>
            </div>
            <p className="text-sm font-medium text-ice-700">{agent.role}</p>
            <p className="mt-2 text-sm text-ice-600">{agent.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamOnline() {
  const agents = (useQuery("agents:list" as never) as Agent[] | undefined) ?? [...AGENTS];
  return <TeamPanel agents={agents} />;
}

export function TeamView() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <TeamPanel agents={[...AGENTS]} />;
  }

  return <TeamOnline />;
}
