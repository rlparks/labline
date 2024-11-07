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

		const idToken = event.locals.session.idToken;

		event.locals.user = null;
		event.locals.session = null;

		if (idToken) {
			const authInfo = await auth.getAuthProviderInfo();
			return redirect(303, authInfo.endSessionEndpoint + "?id_token_hint=" + idToken);
		}

		return redirect(303, "/");
	},
} satisfies Actions;
