import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index";

console.log("Applying SQLite migrations...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied successfully.");