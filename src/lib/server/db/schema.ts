import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	name: text("name").notNull(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
	idToken: text("id_token").notNull(),
	ipAddress: text("ip_address"),
});

export const ROLES_LIST = ["admin"] as const;
export const roles = pgEnum("roles", ROLES_LIST);

export const userRoles = pgTable("user_roles", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	role: roles("role").notNull(),
});

export type Session = typeof sessions.$inferSelect;

export type User = typeof users.$inferSelect;

export type Role = typeof roles.enumValues;

export type UserRole = typeof userRoles.$inferSelect;
