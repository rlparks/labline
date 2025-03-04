import { expect, test } from "vitest";
import { RealUserRepository } from "./RealUserRepository";
import { RealUserRoleRepository } from "./RealUserRoleRepository";

test("can insert and get the same UserRole", async () => {
	const repo = new RealUserRoleRepository();
	const userRepo = new RealUserRepository();
	const newUser = { username: crypto.randomUUID(), name: "perhaps" };
	const insertedUser = await userRepo.createUser(newUser);

	const newRole = await repo.createUserRole({ userId: insertedUser.id, role: "superadmin" });
	const roleFromDb = await repo.getUserRoleById(newRole.id);

	if (!roleFromDb) {
		throw new Error("roleFromDb undefined");
	}

	// hopefully don't have to check every field?
	expect(newRole).toStrictEqual(roleFromDb);

	// if this throws an error, ON DELETE CASCADE is missing
	await userRepo.deleteUserById(insertedUser.id);
});

test("throws on creating UserRole with nonexistent User", async () => {
	const repo = new RealUserRoleRepository();

	await expect(repo.createUserRole({ userId: "e", role: "admin" })).rejects.toThrowError(
		"Foreign key violation",
	);
});

test("throws on creating UserRole with invalid Role", async () => {
	const repo = new RealUserRoleRepository();

	// @ts-expect-error uses an invalid role on purpose
	await expect(repo.createUserRole({ userId: "e", role: "cool" })).rejects.toThrowError(
		"Invalid role",
	);
});
