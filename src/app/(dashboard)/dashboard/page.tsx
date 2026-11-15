
"use client";

import { useTasks } from "@/features/tasks/hooks/useTasks";
import { TaskStatistics } from "@/features/tasks/components/task-statistics";
import { RecentTasks } from "@/features/tasks/components/recent-tasks";

export default function DashboardPage() {
  const { tasks, isLoading, error, refetch } = useTasks();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your tasks.
        </p>
      </header>

      {isLoading ? (
        <p className="text-muted-foreground">Loading tasks...</p>
      ) : error ? (
        <div className="space-y-3">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={refetch} className="text-sm underline">
            Try again
          </button>
        </div>
      ) : (
        <>
          <TaskStatistics tasks={tasks} />
          <RecentTasks tasks={tasks} />
        </>
      )}
    </div>
  );
}
