import { db } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { generateRandomString } from '@oslojs/crypto/random';
import { eq } from 'drizzle-orm';

export async function getUserById(id: string): Promise<User | undefined> {
	const users = await db.select().from(table.users).where(eq(table.users.id, id));

	return users?.[0];
}

/**
 *
 * @param username
 * @returns
 * @throws if the database is unavailable
 */
export async function getUserByUsername(username: string): Promise<User | undefined> {
	const users = await db.select().from(table.users).where(eq(table.users.username, username));

	return users?.[0];
}

/**
 * Inserts a new user into the database.
 *
 * @param username
 * @param password
 * @throws if the username or password is invalid, or the username is already taken
 */
export async function createUser(username: unknown, password: unknown): Promise<User> {
	if (!usernameIsValid(username)) {
		throw new Error(
			`Invalid username. Must be a string between ${usernameLength[0]} and ${usernameLength[1]} characters.`
		);
	}
	if (!passwordIsValid(password)) {
		throw new Error(
			`Invalid password. Must be a string between ${passwordLength[0]} and ${passwordLength[1]} characters.`
		);
	}

	if (await getUserByUsername(username)) {
		throw new Error('Username already taken');
	}

	// known valid username/password

	// ensure the user ID is unique
	let userId = generateTextId();
	while (await getUserById(userId)) {
		userId = generateTextId();
	}

	const passwordHash = await hashPassword(password);
	const user: User = {
		id: userId,
		username,
		passwordHash
	};

	try {
		const insertedUser = await db.insert(table.users).values(user).returning();
		return insertedUser[0];
	} catch {
		throw new Error('Error inserting user');
	}
}

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const usernameLength = [3, 31];
const passwordLength = [6, 255];

function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

function usernameIsValid(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= usernameLength[0] &&
		username.length <= usernameLength[1] &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function passwordIsValid(password: unknown): password is string {
	return (
		typeof password === 'string' &&
		password.length >= passwordLength[0] &&
		password.length <= passwordLength[1]
	);
}

const hashOptions = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};
async function hashPassword(password: string): Promise<string> {
	return await hash(password, hashOptions);
}

async function passwordIsVerified(password: string, passwordHash: string): Promise<boolean> {
	return await verify(passwordHash, password, hashOptions);
}
