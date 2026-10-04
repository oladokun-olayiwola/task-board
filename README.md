# Real-Time Kanban Task Board

A high-performance, real-time collaborative Kanban board built with **React, TypeScript, Hono, Bun, native WebSockets, and SQLite (Drizzle ORM)**.

The project demonstrates low-latency state synchronization across concurrent browser clients using Bun's native WebSocket engine, optimistic UI updates with automatic rollback resilience, and SQLite in WAL mode.

---

## Features

* **Drag-and-Drop Reordering:** Reorder cards and shift across columns with discrete visual position indexing.
* **Real-Time Cross-Client Sync:** Updates instantly broadcast to all connected clients without page reloads.
* **Optimistic UI with Rollback:** State reflects drag actions immediately; reverts gracefully if the network request fails.
* **Full CRUD Operations:** Create, edit title/description, update status/position, and delete cards.
* **Native WebSockets:** Powered by Bun's native C++ pub/sub engine (`tasks-channel`) through Hono without third-party Node adapters.
* **Resilient Connection Handling:** Auto-reconnecting heartbeat hook with live visual indicators.
* **SQLite with WAL Mode:** Fast, concurrent reads and writes managed via Drizzle ORM.
* **Clean Blue Design System:** Flat, high-contrast dark blue UI without distracting gradients or visual clutter.
* **End-to-End Type Safety:** Strict TypeScript interfaces across client state, API contracts, and WebSocket messages.

---

## Tech Stack

### Frontend
* **Framework:** React 19
* **Build Tool:** Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4)
* **Drag and Drop:** `@hello-pangea/dnd`
* **Icons:** `lucide-react`

### Backend & Database
* **Runtime:** Bun
* **Web Framework:** Hono
* **WebSocket Engine:** Bun Native WebSockets (`createBunWebSocket`)
* **ORM:** Drizzle ORM & Drizzle Kit
* **Database Engine:** SQLite via `bun:sqlite` with Write-Ahead Logging (WAL)
* **DevOps:** Docker, Docker Compose, GitHub Actions CI

---

## System Architecture

```text
React (Vite) Client A               React (Vite) Client B
       │                                     ▲
       │ 1. Drag & Drop Reorder               │ 4. Real-time broadcast
       ▼                                     │    (TASKS_REORDERED)
  PATCH /api/tasks/reorder                   │
       │                                     │
       ▼                                     │
┌────────────────────────────────────────────────────────┐
│                      Bun Server                        │
│                                                        │
│  [Hono Router] ──► [Drizzle ORM] ──► [SQLite WAL DB]   │
│         │                                              │
│         └────────► [Native WebSocket Topic Pub/Sub] ───┘
└────────────────────────────────────────────────────────┘

This allows connected clients to receive changes without refreshing the page.

## Project Structure

```text
task-board/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated lint, build & type checking
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx        # DragDropContext container & column renderer
│   │   │   ├── Column.tsx       # Droppable column layout & empty states
│   │   │   ├── Header.tsx       # Top bar, status indicator, action buttons
│   │   │   ├── TaskCard.tsx     # Draggable card item with edit/delete actions
│   │   │   ├── TaskModal.tsx    # Reusable task creation and edit modal
│   │   │   └── Toast.tsx        # Error and network failure notifications
│   │   ├── hooks/
│   │   │   ├── useTasks.ts      # REST API mutations, optimistic updates & state
│   │   │   └── useWebSocket.ts  # Typed WebSocket lifecycle & heartbeat reconnection
│   │   ├── types/
│   │   │   └── task.ts          # Shared client type definitions
│   │   ├── App.tsx              # Application layout orchestrator
│   │   ├── index.css            # Tailwind CSS imports & theme overrides
│   │   └── main.tsx             # React DOM root entrypoint
│   ├── .env.example
│   ├── Dockerfile               # Multi-stage production build (Nginx)
│   ├── nginx.conf               # SPA routing fallback configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── drizzle/                 # Auto-generated SQL migration files
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts         # bun:sqlite connection & WAL configuration
│   │   │   ├── migrate.ts       # Drizzle programmatic migration runner
│   │   │   ├── schema.ts        # Drizzle tasks schema with position ordering
│   │   │   └── seed.ts          # Database seed script
│   │   ├── routes/
│   │   │   └── tasks.ts         # Hono REST endpoints (CRUD + batch reorder)
│   │   ├── types/
│   │   │   └── task.ts          # WebSocket frame interfaces & task payloads
│   │   └── server.ts            # Hono server setup & Bun native WebSocket pub/sub
│   ├── data.db                  # Local SQLite database instance
│   ├── Dockerfile               # Production Bun server container
│   ├── drizzle.config.ts        # Drizzle Kit CLI configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/) (v1.1 or higher)
* [Docker Desktop](https://www.docker.com/) *(optional, for running containerized)*

---

### Local Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/oladokun-olayiwola/task-board
cd task-board
```

### 2. Install client dependencies

```bash
cd client
npm install
```

### 3. Install server dependencies

```bash
cd ../server
npm install
```

### 4. Start the backend

From the `server` directory:

```bash
# Generate and apply SQLite migrations
bun run db:generate
bun run db:migrate

# Seed database with initial board data
bun run db:seed

# Start Hono development server
bun run dev
```

The backend will run on:
```text
http://localhost:4000
```


### 5. Start the frontend

Open another terminal:

```bash
cd client
# Verify environment variables
cp .env.example .env

# Start Vite development server
bun run dev
```
Open the local URL provided by Vite.

 ## Running with Docker Compose
 
To build and run the full stack in isolated production containers:

```bash
docker compose up --build
```
Frontend UI
```text
http://localhost:3000
```

Backend API & WebSockets
The backend will run on:
```text
http://localhost:4000
```

## REST API Specification

| Method   | Endpoint             | Description                                               | Status |
| :------- | :------------------- | :-------------------------------------------------------- | :----- |
| `GET`    | `/api/tasks`         | Retrieve all tasks ordered by position                    | `200`  |
| `POST`   | `/api/tasks`         | Create a task and broadcast `TASK_CREATED`                | `201`  |
| `PATCH`  | `/api/tasks/:id`     | Update title, description, or status (`TASK_UPDATED`)     | `200`  |
| `PATCH`  | `/api/tasks/reorder` | Batch update positions across columns (`TASKS_REORDERED`) | `200`  |
| `DELETE` | `/api/tasks/:id`     | Delete a task and broadcast `TASK_DELETED`                | `200`  |

## WebSocket Events

The WebSocket server broadcasts task changes to connected clients.
The WebSocket gateway connects on `/ws` using typed JSON frames.

```typescript
export type WebSocketMessage =
  | { type: "TASK_CREATED"; task: Task }
  | { type: "TASK_UPDATED"; task: Task }
  | { type: "TASK_DELETED"; taskId: number }
  | { type: "TASKS_REORDERED"; tasks: Task[] };

### Task Created

```json
{
  "type": "TASK_CREATED",
  "task": {
    "id": 10,
    "title": "Build WebSocket Gateway",
    "description": "Implement pub/sub using Bun native WebSockets",
    "status": "todo",
    "position": 2,
    "createdAt": "2026-10-04T03:00:00.000Z"
  }
}
```

### Task Updated

```json
{
  "type": "TASK_UPDATED",
  "task": {
    "id": 10,
    "title": "Build WebSocket Gateway",
    "description": "Updated implementation details",
    "status": "in-progress",
    "position": 0,
    "createdAt": "2026-10-04T03:00:00.000Z"
  }
}
```

### Task Deleted

```json
{
  "type": "TASK_DELETED",
  "taskId": 10
}
```

### Task REORDERED

```json
{
  "type": "TASKS_REORDERED",
  "tasks": [
    { "id": 10, "position": 0, "status": "in-progress" },
    { "id": 12, "position": 1, "status": "in-progress" }
  ]
}
```

## TypeScript

TypeScript is used across the frontend and backend to provide type safety.

Shared concepts such as tasks and WebSocket events should have explicit types.

Example:

```ts
type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}
```

WebSocket messages can also be represented using discriminated unions:

```ts
type WebSocketMessage =
  | {
      type: "TASK_CREATED";
      task: Task;
    }
  | {
      type: "TASK_UPDATED";
      task: Task;
    }
  | {
      type: "TASK_DELETED";
      taskId: number;
    };
```

## Testing Real-Time Updates

To test the real-time functionality:

1. Start both backend and frontend applications.
2. Open http://localhost:5173 in two separate browser windows side by side.
3. Confirm both show the green Connected badge in the header.
4. Create a task in Window 1: It appears immediately in Window 2.
5. Drag and drop a card to another column in Window 2: Window 1 shifts smoothly in real time.
6. Edit a card's title: Changes update immediately across both windows.
7. Simulate Offline Failure: Disconnect your network in DevTools and drag a card. Notice how the card reverts to its initial slot and displays an error toast.

No page refresh should be required.

## Future Improvements

* [ ] Multi-tenant workspace and multi-board support

* [ ] Task assignees with profile avatars

* [ ] Markdown preview support inside task descriptions

* [ ] Due dates with overdue tag alerts

* [ ] Real-time presence cursor tracking

* [ ] Audit log and board activity history

## Learning Goals

This project demonstrates:

* React component architecture
* TypeScript type safety
* React state management
* REST API development
* Node.js and Express
* WebSocket communication
* Real-time state synchronization
* SQLite database persistence
* Client-server architecture
* Asynchronous event handling

## License

This project is licensed under the [MIT License](LICENSE).
