import type { SessionRepository } from "$lib/server/db/repository/interface/SessionRepository";
import type { Session, SafeSession, UserWithRoles } from "$lib/types/entity";

export class RealSessionRepository implements SessionRepository {
	getSessionById(sessionId: string): Promise<Session | undefined> {
		throw new Error("Method not implemented.");
	}
	getSessionsByUserId(userId: string): Promise<SafeSession[]> {
		throw new Error("Method not implemented.");
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
