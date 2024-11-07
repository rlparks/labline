import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import * as auth from "$lib/server/auth";

export const actions = {
	default: async (event) => {
		if (!event.locals.user || !event.locals.session) {
			return redirect(303, "/");
		}
		await auth.deleteSessionTokenCookie(event);
		await auth.invalidateSession(event.locals.session.id);

		event.locals.user = null;
		event.locals.session = null;
		return redirect(303, "/");
	},
} satisfies Actions;
