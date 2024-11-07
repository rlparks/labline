import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	async default(event) {
		const formData = await event.request.formData();
		const code = formData.get("code");

		const apiRes = await event.fetch("/api/auth/login/oidc", {
			method: "POST",
			body: JSON.stringify({ code }),
			headers: {
				"Content-Type": "application/json",
				"User-Agent": event.request.headers.get("user-agent") || "",
			},
		});

		if (!apiRes.ok) {
			const resBody = await apiRes.json();
			const message: string = resBody.message || "Error logging in";
			return error(apiRes.status, message);
		}

		return redirect(303, "/");
	},
};
