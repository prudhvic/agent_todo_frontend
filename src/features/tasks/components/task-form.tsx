
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "../types/task.schema";

import { createTask } from "../services/task.service";
import { getApiError } from "@/lib/api/error";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_at: "",
    },
  });

  const onSubmit = async (values: CreateTaskFormValues) => {
    try {
      await createTask({
        ...values,
        due_at: values.due_at
          ? new Date(values.due_at).toISOString()
          : undefined,
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error(getApiError(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Task title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter task description"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          {...register("priority")}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_at">Due date</Label>
        <Input
          id="due_at"
          type="datetime-local"
          {...register("due_at")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
