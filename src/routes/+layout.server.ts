import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	const ssoProviders = !locals.user ? await (await fetch("/api/auth/methods")).json() : undefined;
	return { user: locals.user, ssoProviders: ssoProviders?.authProviders };
}) satisfies LayoutServerLoad;
