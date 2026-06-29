import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = neon(DATABASE_URL);
const db = drizzle(client);

console.log("Running migrations...");

await migrate(db, { migrationsFolder: "./db/migrations" });

console.log("Migrations applied successfully!");
process.exit(0);
