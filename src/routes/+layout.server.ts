import type { FileStats } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

const USER_NAV_LINKS = [
	{ href: "/buildings", text: "Search by Building", icon: "domain" },
	{ href: "/labs", text: "Search All Labs", icon: "experiment" },
	{ href: "/summary", text: "Summary", icon: "list" },
];

const ADMIN_NAV_LINKS = [
	...USER_NAV_LINKS,
	{ href: "/admin/users", text: "Admin", icon: "admin_panel_settings" },
];

export const load = (async ({ fetch, locals }) => {
	const authInfo = await locals.auth.getAuthProviderInfo();

	const fileStatsRes = await fetch("/api/status");
	const fileStats = fileStatsRes.ok ? ((await fileStatsRes.json()) as FileStats) : null;

	return {
		user: locals.user,
		authInfo,
		fileStats,
		navLinks:
			locals.user?.roles.includes("admin") || locals.user?.roles.includes("superadmin")
				? ADMIN_NAV_LINKS
				: USER_NAV_LINKS,
	};
}) satisfies LayoutServerLoad;
