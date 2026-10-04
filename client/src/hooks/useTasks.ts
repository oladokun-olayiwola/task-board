import { useState, useEffect, useRef, useCallback } from "react";
import { type DropResult } from "@hello-pangea/dnd";
import type { Task, TaskStatus, WebSocketMessage } from "../types/task";

const API_BASE = "http://localhost:4000/api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data: Task[]) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        showError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleWebSocketMessage = useCallback((msg: WebSocketMessage) => {
    setTasks((prev) => {
      switch (msg.type) {
        case "TASK_CREATED":
          if (prev.some((t) => t.id === msg.task.id)) return prev;
          return [...prev, msg.task];

        case "TASK_UPDATED":
          return prev.map((t) => (t.id === msg.task.id ? msg.task : t));

        case "TASK_DELETED":
          return prev.filter((t) => t.id !== msg.taskId);

        case "TASKS_REORDERED": {
          const map = new Map(msg.tasks.map((t) => [t.id, t]));
          return prev.map((t) => map.get(t.id) || t);
        }

        default:
          return prev;
      }
    });
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const previousSnapshot = [...tasksRef.current];
    const taskId = Number(draggableId);
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const sourceCol = tasks
      .filter((t) => t.status === sourceStatus && t.id !== taskId)
      .sort((a, b) => a.position - b.position);

    const destCol =
      sourceStatus === destStatus
        ? sourceCol
        : tasks
            .filter((t) => t.status === destStatus)
            .sort((a, b) => a.position - b.position);

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const movedTask: Task = { ...targetTask, status: destStatus };
    destCol.splice(destination.index, 0, movedTask);

    const reorderedDest = destCol.map((t, idx) => ({ ...t, position: idx }));
    const untouched = tasks.filter(
      (t) => t.status !== sourceStatus && t.status !== destStatus
    );

    const nextTasks = [
      ...untouched,
      ...(sourceStatus !== destStatus
        ? sourceCol.map((t, idx) => ({ ...t, position: idx }))
        : []),
      ...reorderedDest,
    ];

    setTasks(nextTasks);

    const payload = reorderedDest.map((t) => ({
      id: t.id,
      position: t.position,
      status: t.status,
    }));

    try {
      const res = await fetch(`${API_BASE}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Reorder failed on server");
    } catch {
      showError("Sync failed. Reverting changes.");
      setTasks(previousSnapshot);
    }
  };

  const createTask = async (title: string, description: string) => {
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const nextPosition = todoTasks.length;

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          status: "todo",
          position: nextPosition,
        }),
      });

      if (!res.ok) throw new Error("Could not create task");

      const created: Task = await res.json();
      setTasks((prev) =>
        prev.some((t) => t.id === created.id) ? prev : [...prev, created]
      );
    } catch (err: any) {
      showError(err.message);
    }
  };

  const updateTask = async (id: number, title: string, description: string) => {
    const previousSnapshot = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title, description: description || null } : t
      )
    );

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update task");
    } catch {
      showError("Update failed. Reverting.");
      setTasks(previousSnapshot);
    }
  };

  const deleteTask = async (id: number) => {
    const previousSnapshot = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
    } catch {
      showError("Delete failed. Reverting.");
      setTasks(previousSnapshot);
    }
  };

  return {
    tasks,
    isLoading,
    errorMessage,
    handleWebSocketMessage,
    handleDragEnd,
    createTask,
    updateTask,
    deleteTask,
  };
}