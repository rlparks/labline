import { ROLES_LIST } from "$lib/types/entity";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	return {
		roles: [
			// { name: "(none)", value: null },
			...ROLES_LIST.map((role) => ({ name: role, value: role })),
		],
		showRoles: event.locals.user?.roles.includes("superadmin"),
	};
}) satisfies LayoutServerLoad;
