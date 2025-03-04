import { expect, test } from "vitest";
import { RealUserRepository } from "./RealUserRepository";

test("can insert and get the same User", async () => {
	const repo = new RealUserRepository();
	const newUser = { username: crypto.randomUUID(), name: "yes" };

	expect(await repo.getUserByUsername(newUser.username)).toBeUndefined();

	const insertedUser = await repo.createUser(newUser);

	expect(insertedUser).toBeDefined();
	expect(insertedUser.username).toStrictEqual(newUser.username);
	expect(insertedUser.name).toStrictEqual(newUser.name);

	const newUserInDb = await repo.getUserById(insertedUser.id);

	expect(newUserInDb).toBeDefined();

	if (newUserInDb) {
		expect(newUserInDb.id).toStrictEqual(insertedUser.id);
		expect(newUserInDb.username).toStrictEqual(insertedUser.username);
		expect(newUserInDb.name).toStrictEqual(insertedUser.name);
	}

	await repo.deleteUserById(insertedUser.id);
});

test("throws on invalid inserts", async () => {
	const repo = new RealUserRepository();
	const newUser = { username: crypto.randomUUID(), name: "no" };

	const insertedUser = await repo.createUser(newUser);

	expect(insertedUser).toBeDefined();

	await expect(repo.createUser(newUser)).rejects.toThrowError(
		`Duplicate username: ${newUser.username}`,
	);

	await repo.deleteUserById(insertedUser.id);
});

test("persists updates to users", async () => {
	const repo = new RealUserRepository();
	const newUser = { username: crypto.randomUUID(), name: "maybe" };

	const insertedUser = await repo.createUser(newUser);

	const newUserInfo = { username: crypto.randomUUID(), name: "maybe?" };
	const updatedUser = await repo.updateUserById(insertedUser.id, newUserInfo);

	expect(updatedUser).toBeDefined();
	expect(updatedUser?.username).toStrictEqual(newUserInfo.username);
	expect(updatedUser?.name).toStrictEqual(newUserInfo.name);

	await repo.deleteUserById(insertedUser.id);
});
