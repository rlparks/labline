import { sql } from "$lib/server/db";
import type { UserRepository } from "$lib/server/db/repository/interface/UserRepository";
import type { Role, UserWithRoles } from "$lib/types/entity";
import { isUserWithRolesArray } from "$lib/types/entity/guards";

export class RealUserRepository implements UserRepository {
	async getUserById(userId: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
	async getUserByUsername(username: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
	async getUsersByRole(role: Role): Promise<UserWithRoles[]> {
		throw new Error("Method not implemented.");
	}
	async getUsers(): Promise<UserWithRoles[]> {
		try {
			const users = await sql`
                SELECT users.id, users.username, users.name,
                    COALESCE(ARRAY_AGG(user_roles.role ORDER BY user_roles.role)
                        FILTER (WHERE user_roles.role IS NOT NULL), '{}') as roles
                FROM users
                LEFT JOIN user_roles ON users.id = user_roles.user_id
                GROUP BY users.id;`;
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
	async createUser(newUser: { username: string; name: string }): Promise<UserWithRoles> {
		throw new Error("Method not implemented.");
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
