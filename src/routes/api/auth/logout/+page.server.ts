import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({ locals }) => {
		locals.user = null;
		return redirect(303, "/");
	},
} satisfies Actions;
