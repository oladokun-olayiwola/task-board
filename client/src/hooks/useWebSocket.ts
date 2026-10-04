import { useEffect, useRef, useState } from "react";
import type { WebSocketMessage } from "../types/task";

export function useWebSocket(
  url: string,
  onMessage: (msg: WebSocketMessage) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      ws = new WebSocket(url);

      ws.onopen = () => setIsConnected(true);

      ws.onmessage = (event) => {
        try {
          const parsed: WebSocketMessage = JSON.parse(event.data);
          onMessageRef.current(parsed);
        } catch (err) {
          console.error("Failed to parse incoming WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws?.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [url]);

  return { isConnected };
}