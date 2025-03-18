import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const pages = [
		{
			name: "Users",
			href: "/admin/users",
			icon: "person",
		},
	];

	if (event.locals.user?.roles.includes("superadmin")) {
		pages.push({
			name: "Building Aliases",
			href: "/admin/aliases",
			icon: "menu_open",
		});
	}

	return { pages };
}) satisfies LayoutServerLoad;
