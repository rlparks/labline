import { getLabData } from "$lib/server";
import type { Building } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	if (!locals.user) {
		return error(401, "Unauthorized");
	}
	const buildingRes = await fetch("/api/buildings");
	if (!buildingRes.ok) {
		return { buildings: [] };
	}
	const buildings = (await buildingRes.json()) as Building[];
	return { buildings };
}) satisfies PageServerLoad;
