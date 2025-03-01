import { db } from "$lib/server/db";
import * as helpers from "$lib/server/db/entity";
import { combineUsers, UserRole } from "$lib/server/db/entity";
import * as table from "$lib/server/db/schema";
import { type Role, type User, type UserWithRoles } from "$lib/types";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<UserWithRoles | undefined> {
	const userRows = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.where(eq(table.users.id, id))
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId));

	const flatUsers = combineUsers(userRows);
	if (flatUsers.length > 1) {
		throw new Error("Multiple users found with the same ID.");
	}

	return flatUsers[0];
}

/**
 *
 * @param username
 * @returns
 * @throws if the database is unavailable
 */
export async function getUserByUsername(username: string): Promise<UserWithRoles | undefined> {
	const userRows = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.where(eq(table.users.username, username))
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId));

	const flatUsers = combineUsers(userRows);
	if (flatUsers.length > 1) {
		throw new Error("Multiple users found with the same username.");
	}

	return flatUsers[0];
}

/**
 * Gets all users from the database.
 *
 * @returns all users
 */
export async function getUsers(): Promise<UserWithRoles[]> {
	const userRows = await db
		.select({
			id: table.users.id,
			username: table.users.username,
			name: table.users.name,
			role: table.userRoles.role,
		})
		.from(table.users)
		.leftJoin(table.userRoles, eq(table.users.id, table.userRoles.userId))
		.orderBy(table.users.username);

	const flatUsers = combineUsers(userRows);

	return flatUsers;
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
	roles: Role[] = [],
	createRoleIfUserExists: boolean = false,
): Promise<UserWithRoles> {
	if (!helpers.usernameIsValid(username)) {
		throw new Error(`Invalid username: ${username}`);
	}

	if (!helpers.nameIsValid(name)) {
		throw new Error(`Invalid name: ${name}`);
	}

	if (roles) {
		for (const role of roles) {
			if (!helpers.roleIsValid(role)) {
				throw new Error(`Invalid role: ${role}`);
			}
		}
	}

	const existingUser = await getUserByUsername(username);
	if (existingUser) {
		// create role if it doesn't exist
		if (existingUser.roles !== roles && createRoleIfUserExists) {
			await refreshRoles(existingUser.id, roles, true);
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

		if (roles.length > 0) {
			await refreshRoles(userId, roles, false);
		}

		return {
			...insertedUser,
			roles: roles,
		};
	} catch {
		throw new Error("Error inserting user");
	}
}

async function refreshRoles(userId: string, roles: Role[], deleteExistingRoles = true) {
	if (deleteExistingRoles) {
		await UserRole.deleteUserRolesByUserId(userId);
	}

	for (const role of roles) {
		await UserRole.createUserRole(role, userId);
	}
}

/**
 * Updates a user in the database.
 *
 * @param id the id of the user to update
 * @param user the new user data
 * @returns the updated user
 */
export async function updateUserById(id: string, user: unknown): Promise<UserWithRoles> {
	if (!helpers.userWithRolesIsValid(user)) {
		throw new Error(`Invalid user.`);
	}

	if (user.id !== id) {
		throw new Error(`Cannot update user with different ID`);
	}

	const existingUser = await getUserById(id);
	if (!existingUser) {
		throw new Error(`User not found with ID ${id}`);
	}

	await isNotFinalSuperadmin(user, existingUser);

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
	await refreshRoles(id, user.roles, true);

	return {
		...updatedUser,
		roles: user.roles,
	};
}

async function isNotFinalSuperadmin(
	newUserData: UserWithRoles | null,
	existingUser: UserWithRoles,
) {
	if (
		(!newUserData || !newUserData.roles.includes("superadmin")) &&
		existingUser.roles.length !== 0
	) {
		const allSuperadmins = await UserRole.getUserRolesByRole("superadmin");
		if (allSuperadmins.length === 1 && allSuperadmins[0].userId === existingUser.id) {
			throw new Error("Cannot remove final superadmin");
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
export async function deleteUserById(id: string): Promise<UserWithRoles> {
	const user = await getUserById(id);
	if (!user) {
		throw new Error(`User not found`);
	}

	await isNotFinalSuperadmin(null, user);

	await UserRole.deleteUserRolesByUserId(id);

	await db.delete(table.users).where(eq(table.users.id, id));
	return user;
}
