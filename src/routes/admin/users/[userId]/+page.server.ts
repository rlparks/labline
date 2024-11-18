import { error, isHttpError, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";
import type { UserWithRole } from "$lib/types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const userRes = await event.fetch(`/api/users/${event.params.userId}`);
		const user = await userRes.json();

		if (!userRes.ok) {
			return error(userRes.status, user.message || "Error retrieving user");
		}

		return { editUser: user as UserWithRole };
	} catch (err) {
		if (isHttpError(err) && err.body.message) {
			{
				return error(err.status, err.body.message);
			}
		}
		return error(500, "Fetch connection error");
	}
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
	errorMessage: string,
) {
	const formData = await event.request.formData();
	const username = formData.get("username");
	const name = formData.get("name");
	const role = formData.get("role");

	const user = { username, name, role };

	const res = await event.fetch(path, {
		method: method,
		body: JSON.stringify(user),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const resBody = await res.json();
		return error(res.status, resBody.message || errorMessage);
	}

	return redirect(303, "/admin/users");
}
