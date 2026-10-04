import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { Column } from "./components/Column";
import { useWebSocket } from "./hooks/useWebSocket";
import type { Task, TaskStatus, WebSocketMessage } from "./types/task";

const API_BASE = "http://localhost:4000/api/tasks";
const WS_URL = "ws://localhost:4000/ws";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(console.error);
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

  const { isConnected } = useWebSocket(WS_URL, handleWebSocketMessage);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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

    await fetch(`${API_BASE}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todoTasks = tasks.filter((t) => t.status === "todo");
    const nextPosition = todoTasks.length;

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        status: "todo",
        position: nextPosition,
      }),
    });

    if (res.ok) {
      const created: Task = await res.json();
      setTasks((prev) =>
        prev.some((t) => t.id === created.id) ? prev : [...prev, created]
      );
      setTitle("");
      setDescription("");
      setIsCreating(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-[#f8fafc] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0b1329] border-b border-[#1e295d] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#2563eb] rounded-xs" />
          <h1 className="text-base font-bold text-white tracking-wide uppercase">
            Task Board
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 text-xs px-3 py-1 rounded border font-medium ${
              isConnected
                ? "bg-[#0b291d] text-[#4ade80] border-[#166534]"
                : "bg-[#2d1217] text-[#f87171] border-[#991b1b]"
            }`}
          >
            {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Task Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-[#000000]/80 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateTask}
            className="bg-[#0d1738] border border-[#1e295d] p-6 rounded-lg w-full max-w-md flex flex-col gap-4 shadow-xl"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#93c5fd]">
              Add New Task
            </h2>
            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#111c44] border border-[#1e295d] rounded px-3 py-2 text-sm text-[#f8fafc] outline-none focus:border-[#2563eb]"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-[#111c44] border border-[#1e295d] rounded px-3 py-2 text-sm text-[#f8fafc] outline-none focus:border-[#2563eb] resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Columns */}
      <main className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 min-w-[960px] h-full items-start">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={tasks
                  .filter((t) => t.status === col.id)
                  .sort((a, b) => a.position - b.position)}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}