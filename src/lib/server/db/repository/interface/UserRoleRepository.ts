import type { Role, UserRole } from "$lib/types/entity";

/**
 * Contract for `UserRole` database transfer.
 */
export interface UserRoleRepository {
	/**
	 * Find a `UserRole` by ID.
	 *
	 * @param userRoleId the ID of the `UserRole` to search for
	 * @returns the `UserRole` or undefined if no match
	 * @throws on DB connection error
	 */
	getUserRoleById(userRoleId: string): Promise<UserRole | undefined>;

	/**
	 * Insert a `UserRole` into the database.
	 *
	 * @param newUserRole the new `UserRole` to insert
	 * @returns the created `UserRole`
	 * @throws on invalid Role
	 * @throws on DB connection error
	 */
	createUserRole(newUserRole: { userId: string; role: Role }): Promise<UserRole>;

	/**
	 * Delete all `UserRole`s associated with a given `User`.
	 *
	 * @param userId the ID of the `User` to delete `UserRole`s for
	 * @throws if user does not exist
	 * @throws on DB connection error
	 */
	deleteUserRolesByUserId(userId: string): void;
}
