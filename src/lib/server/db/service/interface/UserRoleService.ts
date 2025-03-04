import type { Role, UserRole } from "$lib/types/entity";

/**
 * Contract for exposing `UserRole` data to application.
 */
export interface UserRoleService {
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
	 * @throws if user does not exist
	 * @throws on DB connection error
	 */
	deleteUserRolesByUserId(userId: string): Promise<UserRole[]>;
}
