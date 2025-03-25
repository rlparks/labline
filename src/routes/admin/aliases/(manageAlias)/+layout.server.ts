import type { Building } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

// buildings data is used to show a "matched building"
// hint while inputting a building number on
// /admin/aliases/create and /admin/aliases/[aliasId]
export const load = (async (event) => {
	const buildingsRes = await event.fetch("/api/buildings");
	const buildings = (await buildingsRes.json()) as Building[];

	if (!buildingsRes.ok) {
		return error(buildingsRes.status, "Buildings error");
	}

	return { buildings };
}) satisfies LayoutServerLoad;
