import { getLabFileStats } from "$lib/server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	const stats = await getLabFileStats();
	if (!stats) {
		return json({ error: "Unable to retrieve lab file stats" }, { status: 500 });
	}

	return json(stats);
};
