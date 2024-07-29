import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	const ssoProviders = await (await fetch("/api/auth/methods")).json();
	return { user: locals.user, ssoProviders: ssoProviders.authProviders };
}) satisfies LayoutServerLoad;
