import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, uniqueIndex, integer, text } from "drizzle-orm/sqlite-core"

export const usersTableTemp = sqliteTable("users_table_temp", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	age: integer().notNull(),
	email: text().notNull(),
	email3: text().default("").notNull(),
	phone: text()
},
(table) => {
	return {
		emailUnique: uniqueIndex("users_table_email_unique").on(table.email),
	}
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {
});

export const userTable = sqliteTable("user", {
	id: integer("id").primaryKey()
});

export const sessionTable = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at", {
		mode: "timestamp"
	}).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
