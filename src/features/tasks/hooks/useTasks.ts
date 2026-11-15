
"use client";

import { useCallback, useEffect, useState } from "react";
import { getTasks } from "../services/task.service";
import type { Task } from "../types/task.types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial API request
  useEffect(() => {
    let cancelled = false;

    getTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load tasks. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Manual refetch
  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getTasks();
      setTasks(data);
    } catch {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    refetch,
  };
}
