import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
	default: async ({ locals }) => {
		locals.pb.authStore.clear();
		locals.user = undefined;
		return redirect(303, "/");
	},
} satisfies Actions;
