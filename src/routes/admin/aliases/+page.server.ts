import { buildingAliasArrayIsValid } from "$lib/types/entity/guards";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();

	const aliasesRes = await event.fetch("/api/buildings/aliases");
	const aliases = await aliasesRes.json();

	if (buildingAliasArrayIsValid(aliases)) {
		return {
			pageTitle: "Building Aliases",
			pageDescription: "Manage Building Aliases for labline.",
			aliases,
		};
	} else {
		return error(500, "Building Alias error");
	}
}) satisfies PageServerLoad;

export const actions = {
	create: async (event) => {
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
			console.log(await creationRes.json());
		}

		return redirect(303, "/admin/aliases");
	},
} satisfies Actions;
