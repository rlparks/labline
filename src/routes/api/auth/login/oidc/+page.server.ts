import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { ClientResponseError, type AuthProviderInfo } from "pocketbase";
import { TABLE_NAMES } from "$lib";

export const actions = {
	default: async ({ locals, request }) => {
		const pb = locals.pb;

		try {
			const { provider, code } = Object.fromEntries(await request.formData()) as {
				provider: string;
				code: string;
			};

			if (!provider || !code) {
				return fail(400, { error: "Error: Provider or code not provided." });
			}

			const providerObj = JSON.parse(provider) as AuthProviderInfo;

			// should be the URL this was called from
			const redirectUrl = request.headers.get("referer")?.split("?")[0] ?? "/";

			const authData = await pb
				.collection(TABLE_NAMES.users)
				.authWithOAuth2Code(providerObj.name, code, providerObj.codeVerifier, redirectUrl);

			let username = undefined;
			if (authData.meta) {
				username = authData.meta.username;
			}

			try {
				await pb.collection(TABLE_NAMES.users).update(authData.record.id, { username });
			} catch (err) {
				if (err instanceof ClientResponseError) {
					console.error(
						"Error updating user, likely due to duplicate username:",
						err.originalError.data.data,
					);
				}
			}

			console.log("OIDC LOGIN SUCCESS: " + authData.record.username);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				console.error("Client response error:", err.originalError.data.data);
			}
			return fail(400, { error: "Error: Cannot parse body." });
		}

		return redirect(303, "/");
	},
} satisfies Actions;
