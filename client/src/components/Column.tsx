import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../types/task";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col flex-1 min-w-75 max-w-95 bg-[#0d1738] border border-[#1e295d] rounded-lg p-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e295d]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
          <h3 className="font-semibold text-xs tracking-wider text-[#cbd5e1] uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs bg-[#1e295d] text-[#93c5fd] px-2 py-0.5 rounded font-mono font-medium">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-55 rounded p-1 transition-none flex flex-col ${
              snapshot.isDraggingOver ? "bg-[#142354]" : "bg-transparent"
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center border border-dashed border-[#1e295d] rounded p-4 text-center">
                <span className="text-xs text-[#475569]">No tasks yet</span>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};