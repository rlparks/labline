import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	return {};
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const username = formData.get("username") as string;
		const name = formData.get("name") as string;

		const admin = formData.get("admin") ? ["admin"] : [];
		const superadmin = formData.get("superadmin") ? ["superadmin"] : [];

		const user = {
			username,
			name,
			roles: [...admin, ...superadmin],
		};

		const res = await fetch("/api/users", {
			method: "POST",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const resBody = await res.json();
			return error(res.status, resBody.message || "Error creating user");
		}

		return redirect(303, "/admin/users");
	},
};
