import { TABLE_NAMES } from "$lib";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const ssoProviders = await locals.pb.collection(TABLE_NAMES.users).listAuthMethods();
		return json(ssoProviders);
	} catch {
		return json({ error: "Error: Error retrieving auth methods" }, { status: 500 });
	}
};
