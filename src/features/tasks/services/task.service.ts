import { apiClient } from "@/lib/api/client";
import type { Task } from "../types/task.types";
import { CreateTaskFormValues } from "../types/task.schema";

export async function getTasks(): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>("/tasks");
  return data;
}

export async function createTask(
  payload: CreateTaskFormValues
): Promise<Task> {
  const { data } = await apiClient.post<Task>("/tasks", payload);
  return data;
}


export async function updateTask(
  taskId: string,
  payload: Partial<Pick<Task, "title" | "description" | "status" | "priority" | "due_at">>
): Promise<Task> {
  const { data } = await apiClient.patch<Task>(
    `/tasks/${taskId}`,
    payload
  );

  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}
