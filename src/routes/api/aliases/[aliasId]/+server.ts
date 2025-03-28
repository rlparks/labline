import { logUserAction } from "$lib/server";
import { buildingAliasIsValid } from "$lib/types/entity/guards";
import { validateBuildingAliasFields } from "$lib/types/entity/helpers";
import { validateBuildingNumberExists } from "$lib/types/helpers";
import { error, isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();
	const aliasId = event.params.aliasId;

	const alias = await event.locals.db.buildingAliases.getBuildingAliasById(aliasId);

	if (!alias) {
		return error(404, "Alias not found");
	}
	return json(alias);
};

export const PUT: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();

	const aliasId = event.params.aliasId;
	const body = await event.request.json();
	if (buildingAliasIsValid(body)) {
		try {
			validateBuildingAliasFields(body);

			if (aliasId !== body.id) {
				return error(400, "ID mismatch!");
			}

			await validateBuildingNumberExists(
				await event.locals.labline.getBuildings(),
				body.buildingNumber,
			);

			const alias = await event.locals.db.buildingAliases.updateBuildingAliasById(aliasId, {
				buildingNumber: body.buildingNumber.trim(),
				alias: body.alias.trim(),
			});

			if (!alias) {
				return error(404, "Alias not found");
			}

			if (event.locals.user) {
				logUserAction(event.locals.user, `Updated alias ${alias.buildingNumber} -> ${alias.alias}`);
			}

			return json(alias);
		} catch (err) {
			if (err instanceof Error) {
				return error(400, err.message);
			}

			if (isHttpError(err)) {
				return error(err.status, err.body.message);
			}
		}
	}

	return error(400, "Invalid building alias");
};

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();

	const aliasId = event.params.aliasId;

	const deletedBuildingAlias =
		await event.locals.db.buildingAliases.deleteBuildingAliasById(aliasId);

	return json(deletedBuildingAlias);
};
