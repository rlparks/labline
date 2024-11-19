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
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId))
		.orderBy(table.users.username);

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
	createRoleIfUserExists: boolean = false,
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

	const existingUser = await getUserByUsername(username);
	if (existingUser) {
		// create role if it doesn't exist
		if (existingUser.role === null && role !== null && createRoleIfUserExists) {
			await UserRole.createUserRole(role, existingUser.id);
		}

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

/**
 * Updates a user in the database.
 *
 * @param id the id of the user to update
 * @param user the new user data
 * @returns the updated user
 */
export async function updateUserById(id: string, user: unknown): Promise<UserWithRole> {
	if (!helpers.userWithRoleIsValid(user)) {
		throw new Error(`Invalid user.`);
	}

	if (user.id !== id) {
		throw new Error(`Cannot update user with different ID`);
	}

	const existingUser = await getUserById(id);
	if (!existingUser) {
		throw new Error(`User not found with ID ${id}`);
	}

	await isNotFinalRole(user, existingUser);

	const bareUser: User = {
		id: user.id,
		username: user.username,
		name: user.name,
	};

	const [updatedUser] = await db
		.update(table.users)
		.set(bareUser)
		.where(eq(table.users.id, id))
		.returning();

	// wipe roles
	await UserRole.deleteUserRolesByUserId(id);
	if (user.role) {
		await UserRole.createUserRole(user.role, id);
	}

	return {
		...updatedUser,
		role: user.role,
	};
}

async function isNotFinalRole(newUserData: UserWithRole | null, existingUser: UserWithRole) {
	if ((!newUserData || newUserData.role === null) && existingUser.role !== null) {
		const allRoles = await UserRole.getRoles();
		if (allRoles.length === 1 && allRoles[0].userId === existingUser.id) {
			throw new Error("Cannot delete user with final role");
		}
	}
}

/**
 * Deletes a user from the database.
 *
 * @param id the id of the user to delete
 * @returns the deleted user
 * @throws if the user does not exist
 */
export async function deleteUserById(id: string): Promise<UserWithRole> {
	const user = await getUserById(id);
	if (!user) {
		throw new Error(`User not found`);
	}

	await isNotFinalRole(null, user);

	await UserRole.deleteUserRolesByUserId(id);

	await db.delete(table.users).where(eq(table.users.id, id));
	return user;
}
