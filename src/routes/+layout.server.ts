import type { LayoutServerLoad } from "./$types";
import type { FileStats } from "$lib/types";
import { getAuthProviderInfo } from "$lib/server/auth";

export const load = (async ({ fetch, locals }) => {
	const authInfo = await getAuthProviderInfo();

	const fileStatsRes = await fetch("/api/status");
	const fileStats = fileStatsRes.ok ? ((await fileStatsRes.json()) as FileStats) : null;

	return { user: locals.user, authInfo, fileStats };
}) satisfies LayoutServerLoad;
