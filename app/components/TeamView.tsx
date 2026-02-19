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

type CanonicalStatus = "online" | "idle" | "busy" | "monitoring" | "offline";
type Mood = "working" | "relaxed";

const statusAliases: Record<string, CanonicalStatus> = {
  active: "online",
  online: "online",
  idle: "idle",
  busy: "busy",
  monitoring: "monitoring",
  offline: "offline",
  "在线": "online",
  "空闲": "idle",
  "忙碌": "busy",
  "监控中": "monitoring",
  "离线": "offline"
};

const copy: Record<
  Language,
  {
    title: string;
    subtitle: string;
    workstation: string;
    mode: string;
    profileRole: string;
    profileDescription: string;
    officeRing: string;
    statusLabels: Record<CanonicalStatus, string>;
    statusDescriptions: Record<CanonicalStatus, string>;
    mood: Record<Mood, string>;
    roleFallback: Record<string, string>;
    descriptionFallback: Record<string, string>;
  }
> = {
  zh: {
    title: "数字办公室",
    subtitle: "三位代理在各自工位协同推进 IsuiHome：观察、执行与节奏控制持续同步。",
    workstation: "工位",
    mode: "姿态",
    profileRole: "职责",
    profileDescription: "说明",
    officeRing: "办公室状态环",
    statusLabels: {
      online: "在线",
      idle: "空闲",
      busy: "忙碌",
      monitoring: "监控中",
      offline: "离线"
    },
    statusDescriptions: {
      online: "状态稳定，准备接收下一条指令。",
      idle: "保持待命，当前负载较轻。",
      busy: "正在专注执行任务，工位灯光增强。",
      monitoring: "持续巡检系统信号与任务流。",
      offline: "暂不可用，等待恢复连接。"
    },
    mood: {
      working: "工作中",
      relaxed: "放松中"
    },
    roleFallback: {
      Isui: "家庭节奏编排助手",
      Jarvis: "自动化执行伙伴",
      MC: "任务中枢"
    },
    descriptionFallback: {
      Isui: "负责统筹每日安排，帮助你稳稳推进每一步。",
      Jarvis: "负责执行工具链、巡检流程，并保持系统稳定运行。",
      MC: "负责把控整体目标、节奏和关键决策。"
    }
  },
  en: {
    title: "Digital Office",
    subtitle: "Three agents collaborate from dedicated desks to keep IsuiHome in sync: observe, execute, and steer.",
    workstation: "Workstation",
    mode: "Posture",
    profileRole: "Role",
    profileDescription: "Description",
    officeRing: "Office status ring",
    statusLabels: {
      online: "Online",
      idle: "Idle",
      busy: "Busy",
      monitoring: "Monitoring",
      offline: "Offline"
    },
    statusDescriptions: {
      online: "Stable and ready for incoming instructions.",
      idle: "Standing by with light workload.",
      busy: "Focused on active tasks with boosted desk signals.",
      monitoring: "Continuously watching system signals and task flow.",
      offline: "Temporarily unavailable until connection returns."
    },
    mood: {
      working: "Working",
      relaxed: "Relaxed"
    },
    roleFallback: {
      Isui: "Home rhythm orchestrator",
      Jarvis: "Automation execution partner",
      MC: "Mission control core"
    },
    descriptionFallback: {
      Isui: "Coordinates daily plans and keeps your momentum steady.",
      Jarvis: "Runs toolchains and checks to keep the system stable.",
      MC: "Steers priorities, pace, and key operational decisions."
    }
  }
};

function normalizeStatus(status: string): CanonicalStatus {
  return statusAliases[status.trim().toLowerCase()] ?? statusAliases[status.trim()] ?? "online";
}

function getMood(status: CanonicalStatus): Mood {
  return status === "busy" || status === "monitoring" ? "working" : "relaxed";
}

function getAgentVariant(code: string): "isui" | "jarvis" | "mc" | "default" {
  const normalized = code.trim().toLowerCase();
  if (normalized === "isui") {
    return "isui";
  }
  if (normalized === "jarvis") {
    return "jarvis";
  }
  if (normalized === "mc") {
    return "mc";
  }
  return "default";
}

function TeamPanel({ agents, language }: { agents: Agent[]; language: Language }) {
  const t = copy[language] ?? copy.zh;
  const agentSlots = [...agents].slice(0, 3);

  return (
    <section className="frost digital-office rounded-2xl p-5 shadow-frost transition-colors duration-300">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ice-800">{t.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-ice-600">{t.subtitle}</p>
        </div>
        <span className="rounded-full border border-ice-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-ice-700">
          {t.officeRing}
        </span>
      </div>

      <div className="office-room grid gap-4 md:grid-cols-12">
        {agentSlots.map((agent, index) => {
          const canonicalStatus = normalizeStatus(agent.status);
          const mood = getMood(canonicalStatus);
          const variant = getAgentVariant(agent.code);
          const roleText = agent.role || t.roleFallback[agent.code] || agent.code;
          const descriptionText = agent.description || t.descriptionFallback[agent.code] || "";

          return (
            <article
              key={agent.code}
              className="workstation-card rounded-2xl border border-ice-100 bg-white/75 p-4 shadow-[0_8px_30px_rgba(46,110,182,0.14)] transition-transform duration-300 hover:-translate-y-0.5 md:col-span-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ice-900">{agent.code}</h3>
                <span className="rounded-full border border-ice-200 bg-ice-50 px-2.5 py-1 text-xs font-semibold text-ice-700">
                  {t.statusLabels[canonicalStatus]}
                </span>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-ice-600">
                {t.workstation} #{index + 1}
              </p>

              <div className={`office-pod ${mood === "working" ? "is-working" : "is-relaxed"} ${variant}`}>
                <div className="ambient" />
                <div className="desk" />
                <div className="monitor" />
                <div className="keyboard" />
                <div className="avatar">
                  <span className="head" />
                  <span className="body" />
                  <span className="accent" />
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <p className="text-sm font-medium text-ice-800">
                  {t.mode}: {t.mood[mood]}
                </p>
                <p className="text-sm text-ice-700">
                  {t.profileRole}: {roleText}
                </p>
                <p className="text-sm text-ice-600">
                  {t.profileDescription}: {descriptionText}
                </p>
                <p className="text-sm text-ice-700">{t.statusDescriptions[canonicalStatus]}</p>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .digital-office {
          background:
            radial-gradient(620px 220px at 12% 0%, rgba(255, 255, 255, 0.95), transparent 70%),
            radial-gradient(720px 260px at 90% 0%, rgba(159, 210, 255, 0.35), transparent 72%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(231, 245, 255, 0.8));
        }

        .office-room {
          position: relative;
          padding: 0.15rem;
        }

        .office-room::before {
          content: "";
          position: absolute;
          inset: -0.25rem;
          border-radius: 1.1rem;
          background:
            linear-gradient(145deg, rgba(211, 234, 255, 0.6), rgba(255, 255, 255, 0)),
            repeating-linear-gradient(
              90deg,
              rgba(189, 220, 251, 0.2) 0,
              rgba(189, 220, 251, 0.2) 1px,
              transparent 1px,
              transparent 64px
            );
          z-index: 0;
          pointer-events: none;
        }

        .workstation-card {
          position: relative;
          z-index: 1;
        }

        .office-pod {
          position: relative;
          height: 176px;
          border-radius: 0.95rem;
          overflow: hidden;
          border: 1px solid rgba(180, 217, 250, 0.65);
          background:
            linear-gradient(180deg, rgba(247, 253, 255, 0.96), rgba(225, 242, 255, 0.92)),
            linear-gradient(120deg, rgba(157, 201, 255, 0.2), transparent);
        }

        .ambient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(114, 184, 252, 0.28), transparent 55%);
          opacity: 0.45;
          transition: opacity 320ms ease;
        }

        .desk {
          position: absolute;
          left: 8%;
          right: 8%;
          bottom: 32px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(91, 155, 222, 0.72), rgba(177, 214, 248, 0.8));
          box-shadow: 0 6px 14px rgba(61, 126, 196, 0.28);
        }

        .monitor {
          position: absolute;
          left: 56%;
          top: 34px;
          width: 70px;
          height: 46px;
          border-radius: 0.6rem;
          border: 2px solid rgba(106, 168, 230, 0.58);
          background: linear-gradient(150deg, rgba(190, 224, 255, 0.86), rgba(88, 155, 232, 0.65));
          box-shadow: 0 0 0 rgba(66, 147, 230, 0);
          transition: box-shadow 300ms ease;
        }

        .monitor::after {
          content: "";
          position: absolute;
          left: 48%;
          bottom: -14px;
          width: 5px;
          height: 14px;
          border-radius: 999px;
          background: rgba(100, 157, 216, 0.72);
        }

        .keyboard {
          position: absolute;
          left: 56%;
          bottom: 48px;
          width: 72px;
          height: 8px;
          border-radius: 999px;
          background: rgba(106, 165, 228, 0.52);
        }

        .avatar {
          position: absolute;
          left: 16%;
          bottom: 38px;
          width: 74px;
          height: 104px;
        }

        .head {
          position: absolute;
          left: 16px;
          top: 0;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: linear-gradient(155deg, rgba(239, 250, 255, 0.98), rgba(171, 218, 252, 0.86));
          border: 2px solid rgba(118, 182, 240, 0.65);
        }

        .body {
          position: absolute;
          left: 8px;
          top: 34px;
          width: 56px;
          height: 56px;
          border-radius: 1rem 1rem 0.95rem 0.95rem;
          background: linear-gradient(180deg, rgba(194, 228, 255, 0.95), rgba(106, 170, 235, 0.86));
          border: 2px solid rgba(116, 178, 238, 0.7);
        }

        .accent {
          position: absolute;
          left: 12px;
          top: 42px;
          width: 48px;
          height: 6px;
          border-radius: 999px;
          background: rgba(228, 245, 255, 0.82);
        }

        .is-working .ambient {
          opacity: 0.9;
          animation: ambientPulse 1.7s ease-in-out infinite;
        }

        .is-working .monitor {
          box-shadow: 0 0 16px rgba(81, 162, 244, 0.65), 0 0 26px rgba(81, 162, 244, 0.45);
          animation: monitorGlow 1.4s ease-in-out infinite;
        }

        .is-working .avatar {
          animation: workLean 1.3s ease-in-out infinite;
          transform-origin: bottom left;
        }

        .is-relaxed .avatar {
          left: 12%;
          bottom: 28px;
          animation: relaxedFloat 3.2s ease-in-out infinite;
        }

        .is-relaxed .monitor {
          opacity: 0.9;
        }

        .jarvis .monitor {
          left: 54%;
          width: 76px;
          background: linear-gradient(155deg, rgba(171, 222, 255, 0.94), rgba(66, 140, 224, 0.72));
        }

        .jarvis .accent {
          background: rgba(199, 234, 255, 0.95);
        }

        .mc .head {
          background: linear-gradient(160deg, rgba(236, 248, 255, 1), rgba(157, 211, 253, 0.9));
          border-color: rgba(97, 164, 228, 0.75);
        }

        .mc .body {
          border-radius: 1.2rem 1.2rem 0.85rem 0.85rem;
          background: linear-gradient(180deg, rgba(185, 223, 255, 0.96), rgba(83, 149, 222, 0.9));
        }

        .default .accent {
          opacity: 0.65;
        }

        @keyframes ambientPulse {
          0%,
          100% {
            opacity: 0.58;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes monitorGlow {
          0%,
          100% {
            filter: saturate(1);
            transform: translateY(0);
          }
          50% {
            filter: saturate(1.25);
            transform: translateY(-1px);
          }
        }

        @keyframes workLean {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-1px) rotate(2deg);
          }
        }

        @keyframes relaxedFloat {
          0%,
          100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-2px) rotate(1deg);
          }
        }
      `}</style>
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
