import type { Actions, PageServerLoad } from "./$types";
import { ROLES_LIST } from "$lib/types";

export const load = (async () => {
	return {
		roles: [
			{ name: "(none)", value: null },
			...ROLES_LIST.map((role) => ({ name: role, value: role })),
		],
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get("username") as string;
		const name = formData.get("name") as string;
		const role = formData.get("role") as string;

		console.log("username", username, "name", name, "role", role);
	},
};
