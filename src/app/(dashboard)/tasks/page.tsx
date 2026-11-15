
"use client";

import { useTasks } from "@/features/tasks/hooks/useTasks";
import { TaskList } from "@/features/tasks/components/task-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/features/tasks/components/task-form";
import {
    updateTask,
    deleteTask,
} from "@/features/tasks/services/task.service";

import type { TaskStatus } from "@/features/tasks/types/task.types";



export default function TasksPage() {
    const [showForm, setShowForm] = useState(false);

    const { tasks, isLoading, error, refetch } = useTasks();

    const handleTaskCreated = async () => {
        setShowForm(false);
        await refetch();
    };
    const handleStatusChange = async (
        taskId: string,
        status: TaskStatus
    ) => {
        try {
            await updateTask(taskId, { status });
            await refetch();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async (taskId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            await deleteTask(taskId);
            await refetch();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };
    return (
        <div className="space-y-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Tasks</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage all your tasks in one place.
                    </p>
                </div>

                <Button onClick={() => setShowForm((previous) => !previous)}>
                    {showForm ? "Close" : "Create Task"}
                </Button>
            </header>

            {showForm && (
                <section className="max-w-xl rounded-xl border bg-card p-6">
                    <h2 className="mb-5 text-lg font-semibold">Create a new task</h2>

                    <TaskForm
                        onSuccess={handleTaskCreated}
                        onCancel={() => setShowForm(false)}
                    />
                </section>
            )}

            {isLoading ? (
                <p className="text-muted-foreground">Loading tasks...</p>
            ) : error ? (
                <div className="space-y-3">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" onClick={refetch}>
                        Try again
                    </Button>
                </div>
            ) : (
                <TaskList
                    tasks={tasks}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
