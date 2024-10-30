import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	const stats = await event.locals.knowledger.getLabFileStats();
	if (!stats) {
		return json({ error: "Unable to retrieve lab file stats" }, { status: 500 });
	}

	return json(stats);
};
