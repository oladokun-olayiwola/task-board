import { Hono } from "hono";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq, asc, inArray } from "drizzle-orm";
import type { WebSocketMessage } from "../types/task";

export const taskRoutes = (broadcast: (msg: WebSocketMessage) => void) => {
	const router = new Hono();

	// GET all tasks ordered by position
	router.get("/", async (c) => {
		const allTasks = await db.select().from(tasks).orderBy(asc(tasks.position));
		return c.json(allTasks);
	});

	// POST create task
	router.post("/", async (c) => {
		const body = await c.req.json();
		const [created] = await db
			.insert(tasks)
			.values({
				title: body.title,
				description: body.description ?? null,
				status: body.status ?? "todo",
				position: body.position ?? 0,
			})
			.returning();

		if (!created) {
			return c.json({ error: "Failed to create task" }, 500);
		}

		broadcast({ type: "TASK_CREATED", task: created });
		return c.json(created, 201);
	});

	// PATCH reorder tasks batch
	router.patch("/reorder", async (c) => {
		const body: { id: number; position: number; status: "todo" | "in-progress" | "done" }[] = await c.req.json();

		const updatedTasks = [];
		for (const item of body) {
			const [updated] = await db.update(tasks).set({ position: item.position, status: item.status }).where(eq(tasks.id, item.id)).returning();
			if (updated) updatedTasks.push(updated);
		}

		broadcast({ type: "TASKS_REORDERED", tasks: updatedTasks });
		return c.json(updatedTasks);
	});

	// PATCH update single task
	router.patch("/:id", async (c) => {
		const id = Number(c.req.param("id"));
		const body = await c.req.json();

		const [updated] = await db
			.update(tasks)
			.set({
				...(body.title !== undefined && { title: body.title }),
				...(body.description !== undefined && { description: body.description }),
				...(body.status !== undefined && { status: body.status }),
				...(body.position !== undefined && { position: body.position }),
			})
			.where(eq(tasks.id, id))
			.returning();

		if (!updated) return c.json({ error: "Task not found" }, 404);

		broadcast({ type: "TASK_UPDATED", task: updated });
		return c.json(updated);
	});

	// DELETE task
	router.delete("/:id", async (c) => {
		const id = Number(c.req.param("id"));
		const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();

		if (!deleted) return c.json({ error: "Task not found" }, 404);

		broadcast({ type: "TASK_DELETED", taskId: id });
		return c.json({ success: true, taskId: id });
	});

	return router;
};
