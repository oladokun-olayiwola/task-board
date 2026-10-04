import React from "react";
import { AlertCircle } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#2d1217] border border-[#991b1b] text-[#fca5a5] text-xs px-4 py-2.5 rounded shadow-lg">
      <AlertCircle size={15} />
      <span>{message}</span>
    </div>
  );
};