import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

// Open SQLite database
const expo = SQLite.openDatabaseSync("db.db");

// Create Drizzle ORM instance
export const db = drizzle(expo, { logger: false });

// Run migrations
export function useDatabaseMigrations() {
    return useMigrations(db, migrations);
}