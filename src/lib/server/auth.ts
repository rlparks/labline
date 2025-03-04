import { env } from "$env/dynamic/private";
import type { AuthInfo } from "$lib/types";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import type { RequestEvent } from "@sveltejs/kit";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SCOPES = ["openid", "profile"];

export default class Auth {
	private event: RequestEvent;

	constructor(event: RequestEvent) {
		this.event = event;
	}

	async getAuthProviderInfo(): Promise<AuthInfo> {
		const oidcDiscoveryUrl = env.OIDC_DISCOVERY_ENDPOINT;
		const clientId = env.OIDC_CLIENT_ID;
		if (!oidcDiscoveryUrl || !clientId) {
			throw new Error("OIDC_DISCOVERY_ENDPOINT or OIDC_CLIENT_ID is not set");
		}

		const result = await fetch(oidcDiscoveryUrl);
		if (result.ok) {
			const json = await result.json();

			const state = this.generateSessionToken();

			const authEndpoint = new URL(json.authorization_endpoint);
			authEndpoint.searchParams.set("response_type", "code");
			authEndpoint.searchParams.set("scope", SCOPES.join(" "));
			authEndpoint.searchParams.set("client_id", clientId);
			authEndpoint.searchParams.set("state", state);

			const tokenEndpoint = String(json.token_endpoint);
			const userinfoEndpoint = String(json.userinfo_endpoint);
			const endSessionEndpoint = String(json.end_session_endpoint);
			return {
				authEndpoint: authEndpoint.toString(),
				tokenEndpoint,
				userinfoEndpoint,
				endSessionEndpoint,
				state,
			};
		}

		throw new Error("Error retrieving auth provider info");
	}

	sessionCookieName = "labline-auth-session";

	private generateSessionToken() {
		const bytes = crypto.getRandomValues(new Uint8Array(20));
		const token = encodeBase32LowerCase(bytes);
		return token;
	}

	private hashToken(token: string) {
		return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	}

	async createSession(userId: string, oidcIdToken: string) {
		const token = this.generateSessionToken();
		const hashedToken = this.hashToken(token);
		const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

		const ipAddress = this.event.getClientAddress();

		await this.event.locals.db.sessions.createSession({
			userId,
			hashedToken,
			expiresAt,
			oidcIdToken,
			ipAddress,
		});

		return { token, expiresAt };
	}

	async validateSessionToken(token: string) {
		const hashedToken = this.hashToken(token);
		const session = await this.event.locals.db.sessions.getSessionByHashedToken(hashedToken);

		if (!session) {
			return { session: null, user: null };
		}

		const sessionExpired = Date.now() >= session.expiresAt.getTime();
		if (sessionExpired) {
			await this.invalidateSession(session.id);
			return { session: null, user: null };
		}

		// protect against session hijacking
		const ipAddress = this.event.getClientAddress();
		if (session.ipAddress !== ipAddress) {
			// session is toast anyway
			await this.invalidateSession(session.id);
			return { session: null, user: null };
		}

		const user = await this.event.locals.db.users.getUserById(session.userId);
		if (!user) {
			// this should never happen due to cascade delete, but just in case
			await this.invalidateSession(session.id);
			return { session: null, user: null };
		}

		// session is valid

		const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			this.event.locals.db.sessions.updateSessionById(session.id, session);
		}

		return { session, user };
	}

	async invalidateSession(sessionId: string) {
		await this.event.locals.db.sessions.deleteSessionById(sessionId);
	}

	setSessionTokenCookie(token: string, expiresAt: Date) {
		this.event.cookies.set(this.sessionCookieName, token, {
			path: "/",
			sameSite: "strict",
			expires: expiresAt,
			httpOnly: true,
			secure: true,
		});
	}

	deleteSessionTokenCookie() {
		this.event.cookies.delete(this.sessionCookieName, {
			path: "/",
		});
	}
}
