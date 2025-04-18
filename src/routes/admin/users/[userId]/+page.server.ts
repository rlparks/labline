import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const parentData = await event.parent();
	return {
		pageTitle: `Edit User · ${parentData.editUser.username}`,
		pageDescription: "Edit labline user.",
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async (event) => {
		return await passThroughRequest(
			event,
			`/api/users/${event.params.userId}`,
			"PUT",
			"Error updating user",
		);
	},
	delete: async (event) => {
		return await passThroughRequest(
			event,
			`/api/users/${event.params.userId}`,
			"DELETE",
			"Error deleting user",
		);
	},
};

async function passThroughRequest(
	event: RequestEvent,
	path: string,
	method: string,
	fallbackErrorMessage: string,
) {
	const formData = await event.request.formData();
	const username = formData.get("username");
	const name = formData.get("name");

	// HARDCODED ROLES :(
	const admin = formData.get("admin") ? ["admin"] : [];
	const superadmin = formData.get("superadmin") ? ["superadmin"] : [];

	const user = { id: event.params.userId, username, name, roles: [...admin, ...superadmin] };

	const res = await event.fetch(path, {
		method: method,
		body: JSON.stringify(user),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const resBody = await res.json();
		return fail(res.status, { message: resBody.message || fallbackErrorMessage });
	}

	return redirect(303, "/admin/users");
}
