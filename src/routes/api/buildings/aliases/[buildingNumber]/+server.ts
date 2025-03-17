import { buildingAliasIsValid } from "$lib/types/entity/guards";
import { validateBuildingAliasFields } from "$lib/types/entity/helpers";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();
	const buildingNumber = event.params.buildingNumber;

	const alias =
		await event.locals.db.buildingAliases.getBuildingAliasByBuildingNumber(buildingNumber);
	return json(alias);
};

export const PUT: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();

	const buildingNumber = event.params.buildingNumber;
	const body = await event.request.json();
	if (buildingAliasIsValid(body) && validateBuildingAliasFields(body)) {
		const alias = await event.locals.db.buildingAliases.updateBuildingAliasById(
			buildingNumber,
			body,
		);
		return json(alias);
	}
	return error(400, "Invalid building alias");
};

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();

	const buildingNumber = event.params.buildingNumber;

	const deletedBuildingAlias =
		await event.locals.db.buildingAliases.deleteBuildingAliasByBuildingNumber(buildingNumber);

	return json(deletedBuildingAlias);
};
