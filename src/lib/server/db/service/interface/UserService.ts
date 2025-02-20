import type { UserWithRoles, Role } from "$lib/types/entity";

/**
 * Contract for exposing `User` data to application.
 */
export interface UserService {
	/**
	 * Finds a `User` by ID, with bonus roles.
	 *
	 * @param userId the user to search for
	 * @returns a User with an array of roles
	 * @throws on DB connection error
	 */
	getUserById(userId: string): Promise<UserWithRoles | undefined>;

	/**
	 * Search for a User by username.
	 * (helpful for OIDC login check)
	 *
	 * @param username the username to search for
	 * @returns a User with an array of roles
	 * @throws on DB connection error
	 */
	getUserByUsername(username: string): Promise<UserWithRoles | undefined>;

	/**
	 * Search for all `User`s with a certain `Role`
	 *
	 * @param role the `Role` of the users in question
	 * @returns an array of all `User`s with the provided Role
	 * @throws on DB connection error
	 */
	getUsersByRole(role: Role): Promise<UserWithRoles[]>;

	/**
	 * Get all Users from the database
	 *
	 * @returns an array of all Users contained in the database, plus their roles
	 * @throws on DB connection error
	 */
	getUsers(): Promise<UserWithRoles[]>;

	/**
	 * Inert a new user into the database.
	 *
	 * @param newUser the new User to insert
	 * @returns the inserted user
	 * @throws on DB connection error
	 */
	createUser(newUser: { username: string; name: string; roles: Role[] }): Promise<UserWithRoles>;

	/**
	 * Update a `User` in the database.
	 * Will not allow removal of the final superadmin.
	 *
	 * @param userId the ID of the `User` to update
	 * @param newUser the contents to replace it with
	 * @returns the updated `User`
	 * @throws if no Users are found with the provided `userId`
	 * @throws on DB connection error
	 */
	updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<UserWithRoles>;

	/**
	 * Update a `User`, including a new set of `Role`s.
	 *
	 * @param userId the ID of the `User` to update
	 * @param newUser the new data to insert
	 * @returns the updated `User`
	 * @throws if no Users are found with the provided `userId`
	 * @throws if attempted removal of final superadmin status
	 * @throws on DB connection error
	 */
	updateUserWithRolesById(
		userId: string,
		newUser: { username: string; name: string; roles: Role[] },
	): Promise<UserWithRoles>;

	/**
	 * Delete a `User` from the database.
	 * Will not allow deletion of the final superadmin.
	 *
	 * @param userId the ID of the `User` to delete
	 * @returns the deleted `User`, or undefined if it didn't exist
	 * @throws if attempted deletion of final superadmin account
	 * @throws on DB connection error
	 */
	deleteUserById(userId: string): Promise<UserWithRoles | undefined>;
}
