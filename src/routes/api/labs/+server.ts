import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getLabData } from "$lib/server";

export const GET: RequestHandler = async () => {
	const labs = await getLabData();
	return json(labs);
};
