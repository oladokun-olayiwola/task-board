import React from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";
import type { Task, TaskStatus } from "../types/task";

export const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

interface BoardProps {
  tasks: Task[];
  isLoading: boolean;
  onDragEnd: (result: DropResult) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  tasks,
  isLoading,
  onDragEnd,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-5 min-w-240">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex-1 min-w-75 max-w-95 h-64 bg-[#0d1738] border border-[#1e295d] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 min-w-240 h-full items-start">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks
                .filter((t) => t.status === col.id)
                .sort((a, b) => a.position - b.position)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </DragDropContext>
    </main>
  );
};