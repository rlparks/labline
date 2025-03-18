import { buildingAliasIsValid } from "$lib/types/entity/guards";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();

	const aliasRes = await event.fetch(`/api/buildings/aliases/${event.params.buildingNumber}`);
	const alias = await aliasRes.json();

	if (buildingAliasIsValid(alias)) {
		return {
			pageTitle: `Edit Alias · ${alias.buildingNumber}`,
			pageDescription: "Edit labline building alias.",
		};
	} else {
		return error(aliasRes.status, alias.message ?? "Error loading alias");
	}
}) satisfies PageServerLoad;
