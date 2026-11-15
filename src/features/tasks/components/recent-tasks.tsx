
import type { Task } from "../types/task.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Tasks</h2>

      {recentTasks.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          No tasks available. Create your first task!
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="max-w-[250px]">
                    <p className="truncate font-medium">{task.title}</p>
                    {task.description && (
                      <p className="truncate text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="capitalize">
                    {task.priority}
                  </TableCell>

                  <TableCell>
                    <span className="text-sm capitalize">
                      {task.status.replace("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(task.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
