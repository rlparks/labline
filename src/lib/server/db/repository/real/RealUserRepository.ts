import { sql } from "$db";
import { generateTextId, hideError } from "$db/repository";
import type { UserRepository } from "$db/repository/interface/UserRepository";
import type { Role, User, UserWithRoles } from "$lib/types/entity";
import { isUserWithRolesArray, userIsValid, userWithRolesIsValid } from "$lib/types/entity/guards";

const ROLES_ARRAY = sql`COALESCE(ARRAY_AGG(user_roles.role ORDER BY user_roles.role)
                                    FILTER (WHERE user_roles.role IS NOT NULL), '{}')`;

const SELECT_USERS_QUERY = sql`SELECT users.id, users.username, users.name,
                                ${ROLES_ARRAY} as roles
                            FROM users
                            LEFT JOIN user_roles ON users.id = user_roles.user_id
                            GROUP BY users.id`;

export class RealUserRepository implements UserRepository {
	async getUserById(userId: string): Promise<UserWithRoles | undefined> {
		try {
			const [user] = await sql`${SELECT_USERS_QUERY} HAVING users.id = ${userId};`;
			if (userWithRolesIsValid(user) || user === undefined) {
				return user;
			}
		} catch (err) {
			hideError(err, `RealUserRepository getUserById (${userId}): `);
		}

		throw new Error("User data malformed!");
	}

	async getUserByUsername(username: string): Promise<UserWithRoles | undefined> {
		try {
			const [user] = await sql`${SELECT_USERS_QUERY} HAVING users.username = ${username};`;
			if (userWithRolesIsValid(user) || user === undefined) {
				return user;
			}
		} catch (err) {
			hideError(err, `RealUserRepository getUserByUsername (${username}): `);
		}

		throw new Error("User data malformed!");
	}

	async getUsersByRole(role: Role): Promise<UserWithRoles[]> {
		try {
			const users = await sql`SELECT sub.id, sub.username, sub.name, sub.roles
                                    FROM (${SELECT_USERS_QUERY}) AS sub
                                    WHERE ${role} = ANY(sub.roles);`;
			if (isUserWithRolesArray(users)) {
				return users;
			}
		} catch (err) {
			hideError(err, "RealUserRepository getUsersByRole: ");
		}

		throw new Error("User data malformed!");
	}

	async getUsers(): Promise<UserWithRoles[]> {
		try {
			const users = await sql`${SELECT_USERS_QUERY} ORDER BY users.username;`;
			if (isUserWithRolesArray(users)) {
				return users;
			}
		} catch (err) {
			hideError(err, "RealUserRepository getUsers: ");
		}

		// successful query but didn't return out of try
		throw new Error("User data malformed!");
	}

	async createUser(newUser: { username: string; name: string }): Promise<User> {
		try {
			// on the off chance Bern is the one submitting the form
			// and the ID is a duplicate, the insert will throw an error
			// please just resubmit :)
			const id = generateTextId();
			const [user] = await sql`INSERT INTO users (id, username, name)
                                    VALUES (${id}, ${newUser.username}, ${newUser.name})
                                    RETURNING id, username, name;`;

			if (userIsValid(user)) {
				return user;
			}
		} catch (err) {
			hideError(err, "RealUserRepository createUser: ");
		}

		throw new Error("User data malformed!");
	}

	async updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<User | undefined> {
		try {
			const [user] = await sql`UPDATE users SET ${sql(newUser, "username", "name")}
                                    WHERE users.id = ${userId}
                                    RETURNING id, username, name;`;

			if (userIsValid(user) || user === undefined) {
				return user;
			}
		} catch (err) {
			console.log(err);
			hideError(err, "RealUserRepository updateUserById: ");
		}

		throw new Error("User data malformed!");
	}

	async deleteUserById(userId: string): Promise<User | undefined> {
		try {
			const [user] = await sql`DELETE FROM users
                                    WHERE users.id = ${userId}
                                    RETURNING id, username, name;`;

			if (userIsValid(user)) {
				return user;
			}
		} catch (err) {
			console.log(err);
			hideError(err, "RealUserRepository deleteUserById: ");
		}

		throw new Error("User data malformed!");
	}
}
