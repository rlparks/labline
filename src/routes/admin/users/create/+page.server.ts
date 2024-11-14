import type { Actions, PageServerLoad } from "./$types";
import { ROLES_LIST } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";

export const load = (async () => {
	return {
		roles: [
			{ name: "(none)", value: null },
			...ROLES_LIST.map((role) => ({ name: role, value: role })),
		],
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const username = formData.get("username") as string;
		const name = formData.get("name") as string;
		const role = formData.get("role") as string;

		const user = {
			username,
			name,
			role,
		};

		const res = await fetch("/api/users", {
			method: "POST",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const resBody = await res.json();
			return error(res.status, resBody.message || "Error creating user");
		}

		return redirect(303, "/admin/users");
	},
};
