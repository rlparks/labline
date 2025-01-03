import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { SafeSession, Session, UserWithRoles } from "$lib/types";
import { count, eq } from "drizzle-orm";
import { generateTextId, User } from ".";

async function getSessionById(sessionId: string): Promise<Session | undefined> {
	const [session] = await db.select().from(table.sessions).where(eq(table.sessions.id, sessionId));
	return session;
}

export async function getSessionsByUserId(userId: string): Promise<SafeSession[]> {
	return await db
		.select({
			id: table.sessions.id,
			userId: table.sessions.userId,
			expiresAt: table.sessions.expiresAt,
			ipAddress: table.sessions.ipAddress,
		})
		.from(table.sessions)
		.where(eq(table.sessions.userId, userId));
}

export async function getSessionCountPerUser() {
	return await db
		.select({ userId: table.sessions.userId, sessionsCount: count(table.sessions.id) })
		.from(table.sessions)
		.groupBy(table.sessions.userId)
		.leftJoin(table.users, eq(table.sessions.userId, table.users.id));
}

/**
 * Retrieve a session and corresponding user
 * from the database.
 *
 * @param hashedToken
 * @returns the user and session
 */
export async function getUserSessionByHashedToken(
	hashedToken: string,
): Promise<{ user: UserWithRoles; session: Session } | undefined> {
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			userId: table.users.id,
			session: table.sessions,
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.hashedToken, hashedToken));

	if (!result?.userId) {
		return undefined;
	}

	const user = await User.getUserById(result.userId);

	if (!user) {
		throw new Error("User not found");
	}

	return { user, session: result.session };
}

/**
 * Insert a Session into the database.
 * @returns the new Session
 */
export async function createSession(
	userId: string,
	hashedToken: string,
	expiresAt: Date,
	oidcIdToken: string,
	ipAddress: string | null,
) {
	let sessionId = generateTextId();
	while (await getSessionById(sessionId)) {
		sessionId = generateTextId();
	}

	const session = { id: sessionId, userId, hashedToken, expiresAt, oidcIdToken, ipAddress };

	return await db.insert(table.sessions).values(session).returning();
}

/**
 * Updates the expiresAt timestamp of a Session in the database.
 * @param sessionId
 * @param expiresAt
 * @returns the updated Session
 */
export async function updateSessionExpiresAt(
	sessionId: string,
	expiresAt: Date,
): Promise<Session | undefined> {
	const [updated] = await db
		.update(table.sessions)
		.set({ expiresAt: expiresAt })
		.where(eq(table.sessions.id, sessionId))
		.returning();

	return updated;
}

/**
 * Deletes a Session from the database.
 * @param sessionId
 * @returns the deleted Session
 */
export async function deleteSessionById(sessionId: string) {
	return await db.delete(table.sessions).where(eq(table.sessions.id, sessionId)).returning();
}
