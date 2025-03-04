import type { Role, User, UserWithRoles } from "$lib/types/entity";

/**
 * Contract for `User` database transfer.
 */
export interface UserRepository {
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
	 * @throws on attempt to insert a duplicate username
	 * @throws on the chance a random 21 digit ID already exists :)
	 * @throws on DB connection error
	 */
	createUser(newUser: { username: string; name: string }): Promise<User>;

	/**
	 * Update a `User` in the database.
	 *
	 * @param userId the ID of the `User` to update
	 * @param newUser the contents to replace it with
	 * @returns the updated `User`, or undefined if it didn't exist
	 * @throws on attempt to change to a duplicate username
	 * @throws on DB connection error
	 */
	updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<User | undefined>;

	/**
	 * Delete a `User` from the database.
	 *
	 * @param userId the ID of the `User` to delete
	 * @returns the deleted `User`, or undefined if it didn't exist
	 * @throws on DB connection error
	 */
	deleteUserById(userId: string): Promise<User | undefined>;
}
