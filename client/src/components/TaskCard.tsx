import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2, Pencil } from "lucide-react";
import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 rounded-md bg-[#111c44] border transition-none select-none ${
            snapshot.isDragging
              ? "border-[#2563eb] ring-2 ring-[#2563eb]"
              : "border-[#1e295d] hover:border-[#3b82f6]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-medium text-sm text-[#f8fafc] leading-tight">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="text-[#64748b] hover:text-[#38bdf8] transition-colors p-1"
                title="Edit task"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="text-[#64748b] hover:text-[#ef4444] transition-colors p-1"
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};