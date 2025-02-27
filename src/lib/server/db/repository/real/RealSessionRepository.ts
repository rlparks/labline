import { sql } from "$db";
import { hideError } from "$db/repository";
import type { SessionRepository } from "$db/repository/interface/SessionRepository";
import type { SafeSession, Session, UserWithRoles } from "$lib/types/entity";
import { safeSessionArrayIsValid, sessionIsValid } from "$lib/types/entity/guards";

export class RealSessionRepository implements SessionRepository {
	async getSessionById(sessionId: string): Promise<Session | undefined> {
		try {
			const [session] =
				await sql`SELECT id, user_id, hashed_token, expires_at, oidc_id_token, ip_address
                            FROM sessions
                            WHERE id = ${sessionId};`;

			if (sessionIsValid(session) || session === undefined) {
				return session;
			}
		} catch (err) {
			hideError(err, "RealSessionRepository getSessionById: ");
		}

		// "else"...
		throw new Error("Session malformed!");
	}

	async getSafeSessionsByUserId(userId: string): Promise<SafeSession[]> {
		try {
			const userSessions = await sql`SELECT id, user_id, expires_at, ip_address
                                            FROM sessions
                                            WHERE user_id = ${userId};`;

			if (safeSessionArrayIsValid(userSessions)) {
				return userSessions;
			}
		} catch (err) {
			hideError(err, "RealSessionRepository getSafeSessionsByUserId: ");
		}

		throw new Error("Session malformed!");
	}

	getSessionCountPerUser(): { userId: string; sessionsCount: number }[] {
		throw new Error("Method not implemented.");
	}

	getUserSessionByHashedToken(
		hashedToken: string,
	): Promise<{ user: UserWithRoles; session: Session }> {
		throw new Error("Method not implemented.");
	}

	createSession(newSession: {
		userId: string;
		hashedToken: string;
		expiresAt: Date;
		oidcIdToken: string;
		ipAddress: string | null;
	}): Promise<Session> {
		throw new Error("Method not implemented.");
	}

	updateSessionById(
		sessionId: string,
		newSession: {
			userId: string;
			hashedToken: string;
			expiresAt: Date;
			oidcIdToken: string;
			ipAddress: string | null;
		},
	): Promise<Session> {
		throw new Error("Method not implemented.");
	}

	deleteSessionById(sessionId: string): Promise<Session | undefined> {
		throw new Error("Method not implemented.");
	}
}
