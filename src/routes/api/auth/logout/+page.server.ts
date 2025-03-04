import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		if (!event.locals.user || !event.locals.session) {
			return redirect(303, "/");
		}
		event.locals.auth.deleteSessionTokenCookie();
		await event.locals.auth.invalidateSession(event.locals.session.id);

		const idToken = event.locals.session.oidcIdToken;

		event.locals.user = null;
		event.locals.session = null;

		if (idToken) {
			const authInfo = await event.locals.auth.getAuthProviderInfo();
			const logoutUrl = new URL(authInfo.endSessionEndpoint);
			logoutUrl.searchParams.set("id_token_hint", idToken);
			logoutUrl.searchParams.set("post_logout_redirect_uri", `${event.url.origin}/`);

			return redirect(303, logoutUrl.toString());
		}

		return redirect(303, "/");
	},
} satisfies Actions;
