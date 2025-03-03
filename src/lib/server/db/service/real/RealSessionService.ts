import type { SessionRepository } from "$db/repository/interface/SessionRepository";
import type { SessionService } from "$db/service/interface/SessionService";
import type { SessionCount } from "$lib/types";
import type { SafeSession, Session } from "$lib/types/entity";

export class RealSessionService implements SessionService {
	private readonly sessionRepository: SessionRepository;

	constructor(sessionRepository: SessionRepository) {
		this.sessionRepository = sessionRepository;
	}

	getSessionById(sessionId: string): Promise<Session | undefined> {
		return this.sessionRepository.getSessionById(sessionId);
	}

	getSafeSessionsByUserId(userId: string): Promise<SafeSession[]> {
		return this.sessionRepository.getSafeSessionsByUserId(userId);
	}

	getSessionCountPerUser(): Promise<SessionCount[]> {
		return this.sessionRepository.getSessionCountPerUser();
	}

	getSessionByHashedToken(hashedToken: string): Promise<Session | undefined> {
		return this.sessionRepository.getSessionByHashedToken(hashedToken);
	}

	createSession(newSession: {
		userId: string;
		hashedToken: string;
		expiresAt: Date;
		oidcIdToken: string;
		ipAddress: string | null;
	}): Promise<Session> {
		return this.sessionRepository.createSession(newSession);
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
	): Promise<Session | undefined> {
		return this.sessionRepository.updateSessionById(sessionId, newSession);
	}

	deleteSessionById(sessionId: string): Promise<Session | undefined> {
		return this.sessionRepository.deleteSessionById(sessionId);
	}
}
