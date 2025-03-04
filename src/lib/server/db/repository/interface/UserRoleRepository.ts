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
	 * @throws on invalid userId
	 * @throws on invalid Role
	 * @throws if it randomly generates a duplicate ID
	 * @throws on DB connection error
	 */
	createUserRole(newUserRole: { userId: string; role: Role }): Promise<UserRole>;

	/**
	 * Delete all `UserRole`s associated with a given `User`.
	 *
	 * @param userId the ID of the `User` to delete `UserRole`s for
	 * @returns the deleted `UserRole`s
	 * @throws on DB connection error
	 */
	deleteUserRolesByUserId(userId: string): Promise<UserRole[]>;
}
