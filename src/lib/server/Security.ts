import type { Role, UserWithRole } from "$lib/types";
import { error, type RequestEvent } from "@sveltejs/kit";

// https://www.captaincodeman.com/securing-your-sveltekit-app
export class Security {
	private user: UserWithRole | null;

	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}

	/**
	 *
	 * @throws if the user is not authenticated
	 */
	isAuthenticated() {
		if (!this.user) {
			return error(401, "Unauthorized");
		}
		return this;
	}

	/**
	 *
	 * @param role the required role
	 * @throws 403 if the user does not have the required role or 401 if not authenticated
	 */
	hasRole(role: Role) {
		if (!this.user) {
			return error(401, "Unauthorized");
		}

		if (this.user.role !== role) {
			return error(403, `Missing role: ${role}`);
		}

		return this;
	}

	/**
	 *
	 * @throws 403 if the user does not have the role "admin" or 401 if not authenticated
	 */
	isAdmin() {
		return this.hasRole("admin");
	}
}
