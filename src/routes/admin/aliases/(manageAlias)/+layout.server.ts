import type { Building } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const buildingsRes = await event.fetch("/api/buildings");
	const buildings = (await buildingsRes.json()) as Building[];

	if (!buildingsRes.ok) {
		return error(buildingsRes.status, "Buildings error");
	}

	return { buildings };
}) satisfies LayoutServerLoad;
