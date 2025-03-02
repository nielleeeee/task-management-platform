import { drizzle } from "drizzle-orm/node-postgres";
import { xata } from "@/xata-client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: xata.sql.connectionString, max: 20 });

export const dbPool = drizzle(pool);
