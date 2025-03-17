import { buildingAliasArrayIsValid } from "$lib/types/entity/guards";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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
