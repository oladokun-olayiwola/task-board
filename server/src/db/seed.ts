import { db } from "./index";
import { tasks } from "./schema";

async function seed() {
  console.log("Seeding initial board tasks...");

  await db.insert(tasks).values([
    {
      title: "Set up project repository",
      description: "Initialize client and server directories with Bun and Vite",
      status: "done",
      position: 0,
    },
    {
      title: "Configure Drizzle ORM",
      description: "Set up schema, migration runner, and SQLite WAL mode",
      status: "in-progress",
      position: 0,
    },
    {
      title: "Build Hono REST endpoints",
      description: "Implement CRUD routes for /api/tasks",
      status: "todo",
      position: 0,
    },
    {
      title: "Implement native WebSockets",
      description: "Add bun-native pub/sub channel for task events",
      status: "todo",
      position: 1,
    },
  ]);

  console.log("Database seeded successfully.");
}

seed();