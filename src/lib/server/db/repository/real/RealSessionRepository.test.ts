import type { User } from "$lib/types/entity";
import { expect, test } from "vitest";
import { RealSessionRepository } from "./RealSessionRepository";
import { RealUserRepository } from "./RealUserRepository";

test("can insert, get, and delete a session", async () => {
	const repo = new RealSessionRepository();
	const userRepo = new RealUserRepository();

	const newUser = { username: crypto.randomUUID(), name: "we loggin" };
	const insertedUser: User = await userRepo.createUser(newUser);

	const newSession = {
		userId: insertedUser.id,
		hashedToken: "e",
		expiresAt: new Date(Date.now()),
		oidcIdToken: "e",
		ipAddress: null,
	};

	const insertedSession = await repo.createSession(newSession);

	expect(insertedSession.expiresAt instanceof Date).toBeTruthy();

	const sessionFromDb = await repo.getSessionById(insertedSession.id);

	expect(sessionFromDb).toBeDefined();
	expect(insertedSession).toStrictEqual(sessionFromDb);

	await userRepo.deleteUserById(insertedUser.id);
});

test("can provide accurate session counts per user", async () => {
	const repo = new RealSessionRepository();
	const userRepo = new RealUserRepository();

	const newUser1 = { username: crypto.randomUUID(), name: "we loggin" };
	const newUser2 = { username: crypto.randomUUID(), name: "we loggin again" };
	const insertedUser1: User = await userRepo.createUser(newUser1);
	const insertedUser2: User = await userRepo.createUser(newUser2);

	const newSession1 = {
		userId: insertedUser1.id,
		hashedToken: "a",
		expiresAt: new Date(Date.now()),
		oidcIdToken: "e",
		ipAddress: null,
	};

	const newSession2 = {
		userId: insertedUser2.id,
		hashedToken: "b",
		expiresAt: new Date(Date.now()),
		oidcIdToken: "e",
		ipAddress: null,
	};

	const newSession3 = {
		userId: insertedUser2.id,
		hashedToken: "c",
		expiresAt: new Date(Date.now()),
		oidcIdToken: "e",
		ipAddress: null,
	};

	await repo.createSession(newSession1);
	await repo.createSession(newSession2);
	await repo.createSession(newSession3);

	const counts = await repo.getSessionCountPerUser();

	const countForUser1 = counts.find((countObj) => countObj.userId === insertedUser1.id);
	const countForUser2 = counts.find((countObj) => countObj.userId === insertedUser2.id);

	expect(countForUser1?.sessionsCount).toStrictEqual(1);
	expect(countForUser2?.sessionsCount).toStrictEqual(2);

	await userRepo.deleteUserById(insertedUser1.id);
	await userRepo.deleteUserById(insertedUser2.id);
});
