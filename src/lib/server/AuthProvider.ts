import { env } from "$env/dynamic/private";
import type { AuthInfo } from "$lib/types";

const SCOPES = ["openid", "profile"];

let info: AuthInfo | undefined = undefined;

export default async function getAuthInfo(state: string) {
	// no need to fetch again if known
	if (info) return info;

	const oidcDiscoveryUrl = env.OIDC_DISCOVERY_ENDPOINT;
	const clientId = env.OIDC_CLIENT_ID;
	if (!oidcDiscoveryUrl || !clientId) {
		throw new Error("OIDC_DISCOVERY_ENDPOINT or OIDC_CLIENT_ID is not set");
	}

	const result = await fetch(oidcDiscoveryUrl);
	if (result.ok) {
		const json = await result.json();

		const authEndpoint = new URL(json.authorization_endpoint);
		authEndpoint.searchParams.set("response_type", "code");
		authEndpoint.searchParams.set("scope", SCOPES.join(" "));
		authEndpoint.searchParams.set("client_id", clientId);
		authEndpoint.searchParams.set("state", state);

		const tokenEndpoint = String(json.token_endpoint);
		const userinfoEndpoint = String(json.userinfo_endpoint);
		const endSessionEndpoint = String(json.end_session_endpoint);

		info = {
			authEndpoint: authEndpoint.toString(),
			tokenEndpoint,
			userinfoEndpoint,
			endSessionEndpoint,
			state,
		};

		return info;
	}

	throw new Error("Error retrieving auth provider info");
}
