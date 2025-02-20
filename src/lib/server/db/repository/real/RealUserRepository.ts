import { sql } from "$lib/server/db";
import { generateTextId } from "$lib/server/db/repository";
import type { UserRepository } from "$lib/server/db/repository/interface/UserRepository";
import type { Role, User, UserWithRoles } from "$lib/types/entity";
import { isUserWithRolesArray, userIsValid, userWithRolesIsValid } from "$lib/types/entity/guards";
import postgres from "postgres";

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
			console.error("RealUserRepository getUserById: ", err);
			throw new Error("Error connecting to database");
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
			console.error("RealUserRepository getUserByUsername: ", err);
			throw new Error("Error connecting to database");
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
			console.error("RealUserRepository getUsersByRole: ", err);
			throw new Error("Error connecting to database");
		}

		throw new Error("User data malformed!");
	}

	async getUsers(): Promise<UserWithRoles[]> {
		try {
			const users = await sql`${SELECT_USERS_QUERY};`;
			if (isUserWithRolesArray(users)) {
				return users;
			}
		} catch (err) {
			console.error("RealUserRepository getUsers: ", err);
			throw new Error("Error connecting to database");
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
			if (err instanceof Error) {
				if (err.message.includes("duplicate")) {
					throw new Error("Attempted to insert duplicate value!");
				}
			}
			console.error("RealUserRepository createUser: ", err);
			throw new Error("Error connecting to database");
		}

		// successful query but didn't return out of try
		throw new Error("User data malformed!");
	}

	async updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<UserWithRoles> {
		throw new Error("Method not implemented.");
	}

	async deleteUserById(userId: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
}
