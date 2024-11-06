import { getAuthProviderInfo } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

export const POST: RequestHandler = async (event) => {
	const authInfo = await getAuthProviderInfo();

	if (!authInfo) {
		return error(500, "Auth provider unavailable.");
	}

	const json = await event.request.json();
	const code = json.code;

	if (!codeIsValid(code)) {
		return error(400, "Invalid code");
	}

	const tokenJson = await getAccessToken(
		code,
		authInfo.tokenEndpoint,
		`${event.url.origin}/login/callback`,
	);

	const { access_token, id_token } = tokenJson;

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
	const { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET } = env;

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

	console.log(await result.json());

	if (!result.ok) {
		return error(500, "Failure getting auth token");
	}

	const tokenJson = await result.json();

	if (!tokenResponseIsValid(tokenJson)) {
		return error(500, "Failure getting auth token");
	}

	return tokenJson;
}
