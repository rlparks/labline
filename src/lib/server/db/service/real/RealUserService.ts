import type { UserRepository } from "$lib/server/db/repository/interface/UserRepository";
import type { UserService } from "$lib/server/db/service/interface/UserService";
import type { Role, UserWithRoles } from "$lib/types/entity";

export class RealUserService implements UserService {
	private readonly userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async getUserById(userId: string): Promise<UserWithRoles | undefined> {
		return await this.userRepository.getUserById(userId);
	}

	async getUserByUsername(username: string): Promise<UserWithRoles | undefined> {
		return await this.userRepository.getUserByUsername(username);
	}

	async getUsersByRole(role: Role): Promise<UserWithRoles[]> {
		return await this.userRepository.getUsersByRole(role);
	}

	async getUsers(): Promise<UserWithRoles[]> {
		return await this.userRepository.getUsers();
	}

	async createUser(newUser: { username: string; name: string }): Promise<UserWithRoles> {
		return await this.userRepository.createUser(newUser);
	}

	async updateUserById(
		userId: string,
		newUser: { username: string; name: string },
	): Promise<UserWithRoles> {
		const updatedUser = await this.userRepository.updateUserById(userId, newUser);
		// will be undefined if user didn't exist
		if (!updatedUser) {
			throw new Error("Cannot update a user that does not exist!");
		}

		return updatedUser;
	}

	async updateUserWithRolesById(
		userId: string,
		newUser: { username: string; name: string; roles: Role[] },
	): Promise<UserWithRoles> {
		// first, check if removing superadmin status of final superadmin
		const currentUser = await this.getUserById(userId);

		// if currentUser is undefined, this is skipped due to ?.
		if (currentUser?.roles.includes("superadmin")) {
			// working on a superuser account
			if (!newUser.roles.includes("superadmin")) {
				// removing superadmin role
				// unacceptable if final superadmin!
				await this.throwErrorIfFinalSuperadmin(userId, "Cannot revoke final superadmin status!");
			}
		}

		// in the clear, safe to work on user

		throw new Error("Method not implemented.");
	}

	async deleteUserById(userId: string): Promise<UserWithRoles | undefined> {
		// first, check if deleting final superadmin
		await this.throwErrorIfFinalSuperadmin(userId, "Cannot delete final superuser!");

		return await this.userRepository.deleteUserById(userId);
	}

	private async throwErrorIfFinalSuperadmin(userId: string, errorMessage: string) {
		const superadminUsers = await this.getUsersByRole("superadmin");
		if (superadminUsers.length === 1 && superadminUsers[0].id === userId) {
			throw new Error(errorMessage);
		}
	}
}
