import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DB_FILE_NAME } from "../config/environment.config";

const client = createClient({ url: DB_FILE_NAME });
const db = drizzle({ client });

export default db;
