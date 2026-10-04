import React from "react";
import { Plus, Wifi, WifiOff } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  onOpenCreateModal,
}) => {
  return (
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
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};