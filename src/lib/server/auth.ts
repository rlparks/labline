import { env } from "$env/dynamic/private";
import type { AuthInfo } from "$lib/types";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import type { RequestEvent } from "@sveltejs/kit";
import { Session } from "./db/entity";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SCOPES = ["openid", "profile"];

export async function getAuthProviderInfo(): Promise<AuthInfo> {
	const oidcDiscoveryUrl = env.OIDC_DISCOVERY_ENDPOINT;
	if (!oidcDiscoveryUrl) {
		throw new Error("OIDC_DISCOVERY_ENDPOINT is not set");
	}

	const result = await fetch(oidcDiscoveryUrl);
	if (result.ok) {
		const json = await result.json();

		const state = generateSessionToken();

		const authEndpoint = new URL(json.authorization_endpoint);
		authEndpoint.searchParams.set("response_type", "code");
		authEndpoint.searchParams.set("scope", SCOPES.join(" "));
		authEndpoint.searchParams.set("client_id", env.OIDC_CLIENT_ID);
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

export const sessionCookieName = "labline-auth-session";

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCase(bytes);
	return token;
}

function hashToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(userId: string, oidcIdToken: string, ipAddress: string) {
	const token = generateSessionToken();
	const hashedToken = hashToken(token);
	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

	await Session.createSession(userId, hashedToken, expiresAt, oidcIdToken, ipAddress);
	return { token, expiresAt };
}

export async function validateSessionToken(token: string, event: RequestEvent) {
	const hashedToken = hashToken(token);
	const result = await Session.getUserSessionByHashedToken(hashedToken);

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await invalidateSession(hashedToken);
		return { session: null, user: null };
	}

	// protect against session hijacking
	const ipAddress = event.getClientAddress();
	if (session.ipAddress !== ipAddress) {
		return { session: null, user: null };
	}

	// session is valid

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		Session.updateSessionExpiresAt(hashedToken, session.expiresAt);
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await Session.deleteSessionById(sessionId);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		path: "/",
		sameSite: "strict",
		expires: expiresAt,
		httpOnly: true,
		secure: true,
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: "/",
	});
}
