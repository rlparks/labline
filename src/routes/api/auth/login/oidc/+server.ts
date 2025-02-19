import * as auth from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";
import { User } from "$lib/server/db/repository";
import { getCurrentFormattedDateTime } from "$lib";

const { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_USERNAME_CLAIM } = env;

export const POST: RequestHandler = async (event) => {
	const authInfo = await auth.getAuthProviderInfo();

	if (!authInfo) {
		return error(500, "Auth provider unavailable.");
	}

	const json = await event.request.json();
	const code = json.code;

	if (!codeIsValid(code)) {
		return error(400, "Invalid code");
	}

	const { access_token, id_token } = await getAccessToken(
		code,
		authInfo.tokenEndpoint,
		`${event.url.origin}/login/callback`,
	);

	const userInfo = await getUserInfo(access_token, authInfo.userinfoEndpoint);
	const username = OIDC_USERNAME_CLAIM in userInfo ? userInfo[OIDC_USERNAME_CLAIM] : null;

	if (!username) {
		return error(400, "Missing username");
	}

	await loginUser(username, id_token, event);

	return new Response("OK", { status: 200 });
};

function codeIsValid(code: unknown): code is string {
	return typeof code === "string" && code.length > 0;
}

type TokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
	id_token: string;
};

function tokenResponseIsValid(tokenJson: unknown): tokenJson is TokenResponse {
	return (
		typeof tokenJson === "object" &&
		tokenJson !== null &&
		"access_token" in tokenJson &&
		typeof tokenJson.access_token === "string" &&
		"token_type" in tokenJson &&
		typeof tokenJson.token_type === "string" &&
		"expires_in" in tokenJson &&
		typeof tokenJson.expires_in === "number" &&
		"id_token" in tokenJson &&
		typeof tokenJson.id_token === "string"
	);
}

async function getAccessToken(code: string, tokenEndpoint: string, redirectUri: string) {
	const body = new URLSearchParams();
	body.append("grant_type", "authorization_code");
	body.append("client_id", OIDC_CLIENT_ID);
	body.append("client_secret", OIDC_CLIENT_SECRET);
	body.append("redirect_uri", redirectUri);
	body.append("code", code);

	const result = await fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});

	if (!result.ok) {
		return error(500, "Failure getting auth token");
	}

	const tokenJson = await result.json();

	if (!tokenResponseIsValid(tokenJson)) {
		return error(500, "Failure getting auth token");
	}

	return tokenJson;
}

async function getUserInfo(accessToken: string, userInfoEndpoint: string) {
	const userInfoResponse = await fetch(userInfoEndpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!userInfoResponse.ok) {
		return error(500, "Failure getting user info");
	}

	const userInfoJson = await userInfoResponse.json();

	// authentik openid profile
	// {
	//     sub: '559d7b0af124e9fa495c0cf00f2c0f337458e2337488faf7f9c02e5222f912b0',
	//     name: 'Rebecca Pakrs',
	//     given_name: 'Rebecca Pakrs',
	//     preferred_username: 'rlparks',
	//     nickname: 'rlparks',
	//     groups: [
	//         'authentik Admins',
	//         'headscale',
	//         'planka-admin',
	//         'Brown McCook',
	//         'Proxmox Admins',
	//         'Backups'
	//     ]
	// }

	// UGA SSO openid
	// {
	//     dn: 'CN=ltest020,OU=MyID,DC=devmsmyid,DC=uga,DC=edu',
	//     cn: 'ltest020',
	//     sub: 'ltest020',
	//     service: 'https://lablinedev.ugaesdit.com/login/callback',
	//     auth_time: 1736448428,
	//     id: 'ltest020',
	//     client_id: 'app2labline'
	// }

	if (!userInfoResponseIsValid(userInfoJson)) {
		console.error("Invalid user info response. Try checking your username claim?");
		return error(500, "Failure getting user info");
	}

	return userInfoJson;
}

type UserInfoResponse = Record<string, string>;

function userInfoResponseIsValid(userInfoJson: unknown): userInfoJson is UserInfoResponse {
	return (
		typeof userInfoJson === "object" && userInfoJson !== null && OIDC_USERNAME_CLAIM in userInfoJson
	);
}

async function loginUser(username: string, idToken: string, event: RequestEvent) {
	const user = await User.getUserByUsername(username);
	if (!user) {
		console.log(
			`${getCurrentFormattedDateTime()} · User "${username}" attempted login but does not exist.`,
		);
		return error(400, "User does not exist");
	}

	const ipAddress = event.getClientAddress();

	try {
		const session = await auth.createSession(user.id, idToken, ipAddress);
		console.log(
			`${getCurrentFormattedDateTime()} · User "${username}" logged in, session expiring on ${session.expiresAt.toLocaleDateString()}.`,
		);

		auth.setSessionTokenCookie(event, session.token, session.expiresAt);
	} catch {
		console.error("Error creating session: ", error);
	}
}
