import { buildingAliasIsValid } from "$lib/types/entity/guards";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();

	const aliasRes = await event.fetch(`/api/aliases/${event.params.aliasId}`);
	const alias = await aliasRes.json();

	if (buildingAliasIsValid(alias)) {
		return {
			alias,
			pageTitle: `Delete Alias · ${alias.buildingNumber}`,
			pageDescription: "Delete labline building alias.",
		};
	} else {
		return error(aliasRes.status, alias.message ?? "Error loading alias");
	}
}) satisfies PageServerLoad;
