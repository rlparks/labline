import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();
	return {
		pageTitle: "Create Alias",
		pageDescription: "Create a new Building Alias.",
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		event.locals.security.isSuperadmin();

		const formBody = await event.request.formData();
		const data = Object.fromEntries(formBody);

		const creationRes = await event.fetch("/api/buildings/aliases", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!creationRes.ok) {
			const body = await creationRes.json();
			return error(creationRes.status, body.message || "Error creating alias");
		}

		return redirect(303, "/admin/aliases");
	},
} satisfies Actions;
