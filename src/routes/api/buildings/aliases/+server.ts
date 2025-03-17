import { insertBuildingAliasIsValid } from "$lib/types/entity/guards";
import { validateBuildingAliasFields } from "$lib/types/entity/helpers";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();
	const aliases = await event.locals.db.buildingAliases.getBuildingAliases();
	return json(aliases);
};

export const POST: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();

	const body = await event.request.json();

	if (insertBuildingAliasIsValid(body) && validateBuildingAliasFields(body)) {
		const insertedBuildingAlias = await event.locals.db.buildingAliases.createBuildingAlias(body);
		return json(insertedBuildingAlias);
	}

	return error(400, "Invalid building alias");
};
