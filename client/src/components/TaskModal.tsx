import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";

interface TaskModalProps {
  isOpen: boolean;
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  initialTask,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit(title.trim(), description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0d1738] border border-[#1e295d] p-6 rounded-lg w-full max-w-md flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#93c5fd]">
          {initialTask ? "Edit Task" : "Add New Task"}
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
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
          >
            {initialTask ? "Save Changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};