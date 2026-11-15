
import type { Task } from "../types/task.types";

interface TaskStatisticsProps {
  tasks: Task[];
}

export function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const statistics = [
    {
      title: "Total Tasks",
      count: tasks.length,
    },
    {
      title: "Pending",
      count: tasks.filter((task) => task.status === "pending").length,
    },
    {
      title: "In Progress",
      count: tasks.filter((task) => task.status === "in_progress").length,
    },
    {
      title: "Completed",
      count: tasks.filter((task) => task.status === "completed").length,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map((item) => (
        <div key={item.title} className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{item.title}</p>
          <p className="mt-2 text-3xl font-bold">{item.count}</p>
        </div>
      ))}
    </div>
  );
}
