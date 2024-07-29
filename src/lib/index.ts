// place files you want to import through the `$lib` alias in this folder.

import type { RawUser, SafeUser } from "./types";

export const TABLE_NAMES = {
	users: "users",
};

export const PROVIDER_KEY = "provider";

/**
 * Removes unnecessary info from User objects returned from
 * PocketBase, like email.
 *
 * @param user the full {@link RawUser} object
 * @returns a {@link SafeUser} object with a minimum amount of info
 */
export function makeUserSafe(user: RawUser): SafeUser {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
		hasAvatar: !!user.avatar,
	};
}
