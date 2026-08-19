# Real-Time Task Board

A real-time task management board built with **React, TypeScript, Node.js, Express, WebSockets, and SQLite**.

The project demonstrates how to build a collaborative-style application where task changes are synchronized between connected clients in real time.

## Features

* Create, edit, and delete tasks
* Organize tasks into columns
* Drag and drop tasks between columns
* Persist tasks with SQLite
* Real-time updates using WebSockets
* Synchronize multiple connected clients
* WebSocket connection status
* Fully typed frontend and backend with TypeScript

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Node.js
* TypeScript
* Express
* WebSockets (`ws`)
* SQLite

## Project Structure

```text
realtime-task-board/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── tasks.ts
│   ├── types/
│   │   └── task.ts
│   ├── db.ts
│   ├── websocket.ts
│   ├── server.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd realtime-task-board
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
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL provided by Vite.

## API

| Method   | Endpoint         | Description   |
| -------- | ---------------- | ------------- |
| `GET`    | `/api/tasks`     | Get all tasks |
| `POST`   | `/api/tasks`     | Create a task |
| `PATCH`  | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## WebSocket Events

The WebSocket server broadcasts task changes to connected clients.

### Task Created

```json
{
  "type": "TASK_CREATED",
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "status": "todo"
  }
}
```

### Task Updated

```json
{
  "type": "TASK_UPDATED",
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "status": "done"
  }
}
```

### Task Deleted

```json
{
  "type": "TASK_DELETED",
  "taskId": 1
}
```

## Real-Time Architecture

When a user changes a task:

```text
React Client
     │
     │ HTTP request
     ▼
Express Server
     │
     ├── Update SQLite
     │
     └── Broadcast WebSocket event
              │
       ┌──────┴──────┐
       ▼             ▼
   Client A       Client B
       │             │
       └── Update React state
```

This allows connected clients to receive changes without refreshing the page.

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

1. Start the backend.
2. Start the frontend.
3. Open the application in two browser tabs.
4. Create or update a task in one tab.
5. Confirm the other tab updates automatically.

No page refresh should be required.

## Future Improvements

* [ ] User authentication
* [ ] Multiple boards
* [ ] Task assignments
* [ ] Task priorities
* [ ] Due dates
* [ ] Search and filtering
* [ ] Activity history
* [ ] Online user indicators
* [ ] WebSocket reconnection
* [ ] Optimistic UI updates
* [ ] Production deployment

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

# Real-Time Task Board

A real-time task management board built with **React, TypeScript, Node.js, Express, WebSockets, and SQLite**.

The project demonstrates how to build a collaborative-style application where task changes are synchronized between connected clients in real time.

## Features

* Create, edit, and delete tasks
* Organize tasks into columns
* Drag and drop tasks between columns
* Persist tasks with SQLite
* Real-time updates using WebSockets
* Synchronize multiple connected clients
* WebSocket connection status
* Fully typed frontend and backend with TypeScript

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Node.js
* TypeScript
* Express
* WebSockets (`ws`)
* SQLite

## Project Structure

```text
realtime-task-board/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── tasks.ts
│   ├── types/
│   │   └── task.ts
│   ├── db.ts
│   ├── websocket.ts
│   ├── server.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd realtime-task-board
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
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL provided by Vite.

## API

| Method   | Endpoint         | Description   |
| -------- | ---------------- | ------------- |
| `GET`    | `/api/tasks`     | Get all tasks |
| `POST`   | `/api/tasks`     | Create a task |
| `PATCH`  | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## WebSocket Events

The WebSocket server broadcasts task changes to connected clients.

### Task Created

```json
{
  "type": "TASK_CREATED",
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "status": "todo"
  }
}
```

### Task Updated

```json
{
  "type": "TASK_UPDATED",
  "task": {
    "id": 1,
    "title": "Build dashboard",
    "status": "done"
  }
}
```

### Task Deleted

```json
{
  "type": "TASK_DELETED",
  "taskId": 1
}
```

## Real-Time Architecture

When a user changes a task:

```text
React Client
     │
     │ HTTP request
     ▼
Express Server
     │
     ├── Update SQLite
     │
     └── Broadcast WebSocket event
              │
       ┌──────┴──────┐
       ▼             ▼
   Client A       Client B
       │             │
       └── Update React state
```

This allows connected clients to receive changes without refreshing the page.

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

1. Start the backend.
2. Start the frontend.
3. Open the application in two browser tabs.
4. Create or update a task in one tab.
5. Confirm the other tab updates automatically.

No page refresh should be required.

## Future Improvements

* [ ] User authentication
* [ ] Multiple boards
* [ ] Task assignments
* [ ] Task priorities
* [ ] Due dates
* [ ] Search and filtering
* [ ] Activity history
* [ ] Online user indicators
* [ ] WebSocket reconnection
* [ ] Optimistic UI updates
* [ ] Production deployment

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
