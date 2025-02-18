import type { SafeSession, Session, UserWithRoles } from "$lib/types";

/**
 * Contract for `Session` database transfer.
 */
export interface SessionRepository {
	/**
	 * Find a session by ID.
	 *
	 * @param sessionId the `Session` to search for
	 * @returns the session or undefined if not found
	 */
	getSessionById(sessionId: string): Promise<Session | undefined>;

	/**
	 * Find all sessions by a given user.
	 *
	 * @param userId the user to search for
	 * @returns all `Session`s for a given userId (can be empty)
	 */
	getSessionsByUserId(userId: string): Promise<SafeSession[]>;

	/**
	 * @returns the number of sessions each `userId` has
	 */
	getSessionCountPerUser(): { userId: string; sessionsCount: number }[];

	/**
	 *
	 * @param hashedToken the token to search for
	 * @returns the `User` and `Session` that match the hashed token
	 */
	getUserSessionByHashedToken(
		hashedToken: string,
	): Promise<{ user: UserWithRoles; session: Session }>;

	/**
	 * Insert a `Session` into the database.
	 *
	 * @param newSession the `Session` to insert
	 * @returns the new `Session`
	 */
	createSession(newSession: {
		userId: string;
		hashedToken: string;
		expiresAt: Date;
		oidcIdToken: string;
		ipAddress: string | null;
	}): Promise<Session>;

	/**
	 * Update a `Session` in the database.
	 *
	 * @param sessionId the ID of the `Session` to update
	 * @param newSession the contents to replace it with
	 * @returns the updated `Session`
	 * @throws if no sessions are found with the provided `sessionId`
	 */
	updateSessionById(
		sessionId: string,
		newSession: {
			userId: string;
			hashedToken: string;
			expiresAt: Date;
			oidcIdToken: string;
			ipAddress: string | null;
		},
	): Promise<Session>;

	/**
	 * Delete a `Session` from the database.
	 *
	 * @param sessionId the ID of the `Session` to delete
	 * @returns the deleted `Session`, or undefined if didn't exist
	 */
	deleteSessionById(sessionId: string): Promise<Session | undefined>;
}
