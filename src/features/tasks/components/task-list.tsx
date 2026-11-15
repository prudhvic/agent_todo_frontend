
"use client";

import type { Task, TaskStatus } from "../types/task.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskList({
  tasks,
  onStatusChange,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="font-medium">No tasks found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="max-w-[300px]">
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </TableCell>

              <TableCell className="capitalize">
                {task.priority}
              </TableCell>

              <TableCell>
                <select
                  aria-label={`Status for ${task.title}`}
                  value={task.status}
                  onChange={(event) =>
                    void onStatusChange(
                      task.id,
                      event.target.value as TaskStatus
                    )
                  }
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void onDelete(task.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
