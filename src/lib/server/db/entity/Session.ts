import { db } from "$lib/server/db";
import type { Session, User } from "$lib/server/db/schema";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieve a session and corresponding user
 * from the database.
 *
 * @param sessionId
 * @returns the user and session
 */
export async function getUserSessionBySessionId(
	sessionId: string,
): Promise<{ user: User; session: Session } | undefined> {
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.users.id, username: table.users.username, name: table.users.name },
			session: table.sessions,
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.id, sessionId));

	return result;
}

/**
 * Insert a Session into the database.
 * @param session
 * @returns the new Session
 */
export async function createSession(session: Session) {
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
export async function deleteSession(sessionId: string) {
	return await db.delete(table.sessions).where(eq(table.sessions.id, sessionId)).returning();
}
