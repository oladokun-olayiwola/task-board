import { useState } from "react";
import { Header } from "./components/Header";
import { Board } from "./components/Board";
import { TaskModal } from "./components/TaskModal";
import { Toast } from "./components/Toast";
import { useWebSocket } from "./hooks/useWebSocket";
import { useTasks } from "./hooks/useTasks";
import type { Task } from "./types/task";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000/ws";

export default function App() {
  const {
    tasks,
    isLoading,
    errorMessage,
    handleWebSocketMessage,
    handleDragEnd,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const { isConnected } = useWebSocket(WS_URL, handleWebSocketMessage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const openCreateModal = () => {
    setActiveTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (title: string, description: string) => {
    if (activeTask) {
      await updateTask(activeTask.id, title, description);
    } else {
      await createTask(title, description);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-[#f8fafc] flex flex-col font-sans">
      <Header
        isConnected={isConnected}
        onOpenCreateModal={openCreateModal}
      />

      <Board
        tasks={tasks}
        isLoading={isLoading}
        onDragEnd={handleDragEnd}
        onEdit={openEditModal}
        onDelete={deleteTask}
      />

      <TaskModal
        isOpen={isModalOpen}
        initialTask={activeTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <Toast message={errorMessage} />
    </div>
  );
}