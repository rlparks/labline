import type { AuthProviderInfo } from "pocketbase";
import type { LayoutServerLoad } from "./$types";
import type { FileStats } from "$lib/types";

type ProviderResponse = {
	authProviders: AuthProviderInfo[];
	usernamePassword: boolean;
	emailPassword: boolean;
	onlyVerified: boolean;
};

export const load = (async ({ fetch, locals }) => {
	const shouldGetProvider = !locals.user;
	let ssoProvider: AuthProviderInfo | undefined;
	if (shouldGetProvider) {
		const ssoRes = await fetch("/api/auth/methods");
		const ssoProviders = (await ssoRes.json()) as ProviderResponse;
		ssoProvider = ssoProviders?.authProviders?.[0];
	}

	const fileStatsRes = await fetch("/api/status");
	const fileStats = (await fileStatsRes.json()) as FileStats;

	return { user: locals.user, ssoProvider, fileStats };
}) satisfies LayoutServerLoad;
