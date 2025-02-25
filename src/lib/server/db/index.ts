import { env } from "$env/dynamic/private";
import postgres from "postgres";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
export const sql = postgres(env.DATABASE_URL, { transform: postgres.camel });
