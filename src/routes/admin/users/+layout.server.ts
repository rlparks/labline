import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	// hardcoded roles
	const roles = [
		{
			name: "admin",
			value: "admin",
			description: "Can create, edit, and delete accounts without roles",
		},
		{
			name: "superadmin",
			value: "superadmin",
			description:
				"Has full control over all accounts and can manage sessions and building aliases",
		},
	] satisfies DisplayRole[];

	return {
		roles,
		showRoles: event.locals.user?.roles.includes("superadmin"),
	};
}) satisfies LayoutServerLoad;

type DisplayRole = {
	name: string;
	value: "admin" | "superadmin";
	description: string;
};
