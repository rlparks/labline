import { ROLES_LIST } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
	return {
		roles: [
			// { name: "(none)", value: null },
			...ROLES_LIST.map((role) => ({ name: role, value: role })),
		],
	};
}) satisfies LayoutServerLoad;
