import type { UserRepository } from "$lib/server/db/repository/interface/UserRepository";
import type { Role, UserWithRoles } from "$lib/types/entity";

export class RealUserRepository implements UserRepository {
	getUserById(userId: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
	getUserByUsername(username: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
	getUsersByRole(role: Role): Promise<UserWithRoles[]> {
		throw new Error("Method not implemented.");
	}
	getUsers(): Promise<UserWithRoles[]> {
		throw new Error("Method not implemented.");
	}
	createUser(newUser: { username: string; name: string }): Promise<UserWithRoles> {
		throw new Error("Method not implemented.");
	}
	updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<UserWithRoles> {
		throw new Error("Method not implemented.");
	}
	deleteUserById(userId: string): Promise<UserWithRoles | undefined> {
		throw new Error("Method not implemented.");
	}
}
