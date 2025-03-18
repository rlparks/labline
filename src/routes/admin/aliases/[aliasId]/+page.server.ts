import { buildingAliasIsValid } from "$lib/types/entity/guards";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();

	const aliasRes = await event.fetch(`/api/aliases/${event.params.aliasId}`);
	const alias = await aliasRes.json();

	if (buildingAliasIsValid(alias)) {
		return {
			alias,
			pageTitle: `Edit Alias · ${alias.buildingNumber}`,
			pageDescription: "Edit labline building alias.",
		};
	} else {
		return error(aliasRes.status, alias.message ?? "Error loading alias");
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async (event) => {
		return await passThroughRequest(
			event,
			`/api/aliases/${event.params.aliasId}`,
			"PUT",
			"Error updating alias",
		);
	},
	delete: async (event) => {
		return await passThroughRequest(
			event,
			`/api/aliases/${event.params.aliasId}`,
			"DELETE",
			"Error deleting alias",
		);
	},
};

async function passThroughRequest(
	event: RequestEvent,
	path: string,
	method: "PUT" | "DELETE",
	errorMessage: string,
) {
	const formData = await event.request.formData();
	const body = Object.fromEntries(formData.entries());

	const res = await event.fetch(path, {
		method: method,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const resBody = await res.json();
		return fail(res.status, { message: resBody.message || errorMessage });
	}

	return redirect(303, "/admin/aliases");
}
