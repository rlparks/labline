import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		event.locals.user = null;
		event.locals.session = null;
		return redirect(303, "/");
	},
} satisfies Actions;
