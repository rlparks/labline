import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { User, UserWithRole } from "$lib/types";
import { generateRandomString } from "@oslojs/crypto/random";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<User | undefined> {
	const users = await db.select().from(table.users).where(eq(table.users.id, id));

	return users?.[0];
}

/**
 *
 * @param username
 * @returns
 * @throws if the database is unavailable
 */
export async function getUserByUsername(username: string): Promise<UserWithRole | undefined> {
	const users = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.where(eq(table.users.username, username))
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId));

	return users?.[0];
}

/**
 * Gets all users from the database.
 *
 * @returns all users
 */
export async function getUsers() {
	const users = await db.select().from(table.users);
	return users;
}

/**
 * Inserts a new user into the database.
 *
 * @param username
 * @param password
 * @throws if the username or password is invalid, or the username is already taken
 */
export async function createUser(username: unknown, name: unknown): Promise<User> {
	if (!usernameIsValid(username)) {
		throw new Error(
			`Invalid username. Must be a string between ${usernameLength[0]} and ${usernameLength[1]} characters.`,
		);
	}

	if (!nameIsValid(name)) {
		throw new Error(`Invalid name.`);
	}

	if (await getUserByUsername(username)) {
		throw new Error(`Username "${username}" already taken`);
	}

	// ensure the user ID is unique
	let userId = generateTextId();
	while (await getUserById(userId)) {
		userId = generateTextId();
	}

	const user: User = {
		id: userId,
		username,
		name,
	};

	try {
		const insertedUser = await db.insert(table.users).values(user).returning();
		return insertedUser[0];
	} catch {
		throw new Error("Error inserting user");
	}
}

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const usernameLength = [1, 255] as const;

function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

function usernameIsValid(username: unknown): username is string {
	return (
		typeof username === "string" &&
		username.length >= usernameLength[0] &&
		username.length <= usernameLength[1] &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function nameIsValid(name: unknown): name is string {
	return typeof name === "string" && name.length <= 255;
}
