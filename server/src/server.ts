import { Hono } from "hono";
import { cors } from "hono/cors";
import { upgradeWebSocket, websocket } from "@hono/bun";
import { taskRoutes } from "./routes/tasks";
import type { WebSocketMessage } from "./types/task";


const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

let serverRef: any = null;

const broadcast = (message: WebSocketMessage) => {
  if (serverRef) {
    serverRef.publish("tasks-channel", JSON.stringify(message));
  }
};

// Mount Task REST API
app.route("/api/tasks", taskRoutes(broadcast));

// WebSocket Upgrade route
app.get(
  "/ws",
  upgradeWebSocket(() => ({
    onOpen(_event, ws) {
      ws.raw.subscribe("tasks-channel");
    },
    onClose(_event, ws) {
      ws.raw.unsubscribe("tasks-channel");
    },
  }))
);

serverRef = Bun.serve({
  fetch: app.fetch,
  websocket,
  port: process.env.PORT || 4000,
});

console.log(`Server listening at http://localhost:${serverRef.port}`);