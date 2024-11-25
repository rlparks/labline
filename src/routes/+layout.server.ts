import type { LayoutServerLoad } from "./$types";
import type { FileStats } from "$lib/types";
import { getAuthProviderInfo } from "$lib/server/auth";

const USER_NAV_LINKS = [
	{ href: "/", text: "Search by Building", icon: "domain" },
	{ href: "/labs", text: "Search All Labs", icon: "experiment" },
	{ href: "/summary", text: "Summary", icon: "list" },
];

const ADMIN_NAV_LINKS = [
	...USER_NAV_LINKS,
	{ href: "/admin/users", text: "Users", icon: "admin_panel_settings" },
];

export const load = (async ({ fetch, locals }) => {
	const authInfo = await getAuthProviderInfo();

	const fileStatsRes = await fetch("/api/status");
	const fileStats = fileStatsRes.ok ? ((await fileStatsRes.json()) as FileStats) : null;

	return {
		user: locals.user,
		authInfo,
		fileStats,
		navLinks: locals.user?.role === "admin" ? ADMIN_NAV_LINKS : USER_NAV_LINKS,
	};
}) satisfies LayoutServerLoad;
