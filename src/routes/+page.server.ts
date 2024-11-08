import type { Building } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	locals.security.isAuthenticated();
	const buildingRes = await fetch("/api/buildings");

	if (!buildingRes.ok) {
		return error(buildingRes.status, "Error retrieving buildings");
	}
	const buildings = (await buildingRes.json()) as Building[];
	return { buildings };
}) satisfies PageServerLoad;
