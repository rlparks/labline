import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getLabData } from "$lib/server";

export const GET: RequestHandler = async () => {
	try {
		const labs = await getLabData();
		return json(labs);
	} catch {
		return error(500, "Error retrieving labs");
	}
};
