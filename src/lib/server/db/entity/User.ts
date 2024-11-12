import { db } from "$lib/server/db";
import * as helpers from "$lib/server/db/entity";
import { UserRole } from "$lib/server/db/entity";
import * as table from "$lib/server/db/schema";
import { type Role, type User, type UserWithRole } from "$lib/types";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<UserWithRole | undefined> {
	const users = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.where(eq(table.users.id, id))
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId));

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
export async function getUsers(): Promise<UserWithRole[]> {
	const users = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId));

	return users;
}

/**
 * Inserts a new user into the database.
 *
 * @param username
 * @param password
 * @throws if the username or password is invalid, or the username is already taken
 */
export async function createUser(
	username: unknown,
	name: unknown,
	role: Role | null = null,
): Promise<UserWithRole> {
	if (!helpers.usernameIsValid(username)) {
		throw new Error(`Invalid username.`);
	}

	if (!helpers.nameIsValid(name)) {
		throw new Error(`Invalid name.`);
	}

	if (role && !helpers.roleIsValid(role)) {
		throw new Error(`Invalid role.`);
	}

	if (await getUserByUsername(username)) {
		throw new Error(`Username "${username}" already taken`);
	}

	// ensure the user ID is unique
	let userId = helpers.generateTextId();
	while (await getUserById(userId)) {
		userId = helpers.generateTextId();
	}

	const user: User = {
		id: userId,
		username,
		name,
	};

	try {
		const [insertedUser] = await db.insert(table.users).values(user).returning();

		if (role) {
			await UserRole.createUserRole(role, userId);
		}

		return {
			...insertedUser,
			role: role ?? null,
		};
	} catch {
		throw new Error("Error inserting user");
	}
}
