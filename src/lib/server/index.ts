import { getFormattedDateTime } from "$lib";
import type { User } from "$lib/types/entity";

/**
 * Removes unnecessary info from User objects returned from
 * PocketBase, like email.
 *
 * @param user the full {@link RawUser} object
 * @returns a {@link User} object with a minimum amount of info
 */
export function makeUserSafe(user: User): User {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
	};
}

/**
 * @returns a readable date/time
 */
export function getCurrentFormattedDateTime(): string {
	const now = new Date();
	return getFormattedDateTime(now);
}
