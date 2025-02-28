import { sql } from "$db";
import { generateTextId, hideError } from "$db/repository";
import type { SessionRepository } from "$db/repository/interface/SessionRepository";
import type { SessionCount } from "$lib/types";
import type { SafeSession, Session, UserWithRoles } from "$lib/types/entity";
import {
	safeSessionArrayIsValid,
	sessionCountArrayIsValid,
	sessionIsValid,
} from "$lib/types/entity/guards";

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

	async getSessionCountPerUser(): Promise<SessionCount[]> {
		try {
			const counts = await sql`SELECT user_id, count(id)::int AS sessions_count
                                    FROM sessions
                                    GROUP BY user_id;`;

			if (sessionCountArrayIsValid(counts)) {
				return counts;
			}
		} catch (err) {
			hideError(err, "RealSessionRepository getSessionCountPerUser: ");
		}

		throw new Error("Session count malformed!");
	}

	async getUserSessionByHashedToken(
		hashedToken: string,
	): Promise<{ user: UserWithRoles; session: Session }> {
		throw new Error("Method not implemented.");
	}

	async createSession(newSession: {
		userId: string;
		hashedToken: string;
		expiresAt: Date;
		oidcIdToken: string;
		ipAddress: string | null;
	}): Promise<Session> {
		try {
			// :)
			const id = generateTextId();
			const [session] =
				await sql`INSERT INTO sessions (id, user_id, hashed_token, expires_at, oidc_id_token, ip_address)
                            VALUES (${id}, ${newSession.userId}, ${newSession.hashedToken}, ${newSession.expiresAt},
                                ${newSession.oidcIdToken}, ${newSession.ipAddress})
                            RETURNING id, user_id, hashed_token, expires_at, oidc_id_token, ip_address;`;

			if (sessionIsValid(session)) {
				return session;
			}
		} catch (err) {
			hideError(err, "RealSessionRepository createSession: ");
		}

		throw new Error("Session malformed!");
	}

	async updateSessionById(
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

	async deleteSessionById(sessionId: string): Promise<Session | undefined> {
		try {
			const [deletedSession] = await sql`DELETE FROM sessions
                                                WHERE id = ${sessionId}
                                                RETURNING id, user_id, hashed_token, expires_at, oidc_id_token, ip_address;`;

			if (sessionIsValid(deletedSession) || deletedSession === undefined) {
				return deletedSession;
			}
		} catch (err) {
			hideError(err, "RealSessionRepository deleteSessionById: ");
		}

		throw new Error("Session malformed!");
	}
}
