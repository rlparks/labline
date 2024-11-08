import * as table from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { UserRole } from "$lib/server/db/schema";
import * as helpers from "$lib/server/db/entity";

export async function getUserRoleById(id: string): Promise<UserRole | undefined> {
	const roles = await db.select().from(table.userRoles).where(eq(table.userRoles.id, id));

	return roles?.[0];
}

export async function createUserRole(role: unknown, userId: unknown): Promise<UserRole> {
	if (!helpers.roleIsValid(role) || role === undefined) {
		throw new Error(`Invalid role.`);
	}

	if (!helpers.idIsValid(userId)) {
		throw new Error(`Invalid user ID.`);
	}

	let id = helpers.generateTextId();
	while (await getUserRoleById(id)) {
		id = helpers.generateTextId();
	}

	const insertedUserRole = await db
		.insert(table.userRoles)
		.values({
			id,
			userId,
			role,
		})
		.returning();

	return insertedUserRole[0];
}
