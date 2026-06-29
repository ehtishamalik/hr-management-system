import * as schema from "./schema";

import { neon, neonConfig, Pool } from "@neondatabase/serverless";
// HTTP (no transactions, faster cold starts)
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
// WebSocket/Pool (transactions supported)
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

// ---------- HTTP connection ----------
const clientHttp = neon(process.env.DATABASE_URL);
export const db = drizzleHttp(clientHttp, { schema });

// ---------- WebSocket connection ----------
neonConfig.webSocketConstructor = globalThis.WebSocket;
const clientWs = new Pool({ connectionString: process.env.DATABASE_URL });
export const wsdb = drizzleWs(clientWs, { schema });
