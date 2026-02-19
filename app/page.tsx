import { TaskBoard } from "./components/TaskBoard";
import { CalendarView } from "./components/CalendarView";
import { MemoryView } from "./components/MemoryView";
import { TeamView } from "./components/TeamView";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl p-4 pb-10 md:p-8">
      <header className="mb-6 rounded-2xl frost p-6 shadow-frost">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice-600">IsuiHome</p>
        <h1 className="mt-2 text-3xl font-semibold text-ice-900 md:text-4xl">Mission Control</h1>
        <p className="mt-2 max-w-2xl text-sm text-ice-700">
          Unified command center for tasks, automations, memory, and agent roles. Powered by Next.js, Tailwind CSS,
          and Convex realtime data.
        </p>
      </header>

      <div className="grid gap-5">
        <TaskBoard />
        <CalendarView />
        <MemoryView />
        <TeamView />
      </div>
    </main>
  );
}
