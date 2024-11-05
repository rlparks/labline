import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	name: text("name").notNull(),
	passwordHash: text("password_hash").notNull(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

export const roles = pgEnum("roles", ["admin"]);

export const userRoles = pgTable("user_roles", {
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	role: roles("role").notNull(),
});

export type Session = typeof sessions.$inferSelect;

export type User = typeof users.$inferSelect;
