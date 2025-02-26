import { generateRandomString } from "@oslojs/crypto/random";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

export function hideError(err: unknown, consoleText: string, duplicateText?: string) {
	if (err instanceof Error) {
		if (err.message.includes("duplicate")) {
			if (duplicateText) {
				console.error(`Duplicate: ${duplicateText}`);
			}

			throw new Error("Attempted to insert duplicate value!");
		}
	}
	console.error(consoleText, err);
	throw new Error("Error connecting to database");
}
