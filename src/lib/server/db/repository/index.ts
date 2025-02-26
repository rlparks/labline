import { DatabaseConnectionError } from "$db/errors/DatabaseConnectionError";
import { UniqueConstraintViolation } from "$db/errors/UniqueConstraintViolation";
import { generateRandomString } from "@oslojs/crypto/random";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

export function hideError(err: unknown, consoleText: string) {
	console.error(consoleText, err);

	const uniqueViolation = parseUniqueViolation(err);
	if (uniqueViolation) {
		if (uniqueViolation.columnViolated) {
			throw new UniqueConstraintViolation(uniqueViolation.columnViolated, uniqueViolation.contents);
		} else {
			throw new UniqueConstraintViolation("unknown");
		}
	}

	throw new DatabaseConnectionError();
}

function parseUniqueViolation(err: unknown) {
	if (err instanceof Error && err.message.includes("duplicate")) {
		if (
			"detail" in err &&
			typeof err.detail === "string" &&
			err.detail.includes("already exists")
		) {
			// detail: 'Key (username)=(f749e608-76e5-4394-9d88-24c7a9aa9575) already exists.',

			const firstOpenParenIndex = err.detail.indexOf("(");
			const firstCloseParenIndex = err.detail.indexOf(")");

			const secondOpenParenIndex = err.detail.indexOf("(", firstCloseParenIndex);
			const secondCloseParenIndex = err.detail.indexOf(")", secondOpenParenIndex);

			const columnViolated = err.detail.substring(firstOpenParenIndex + 1, firstCloseParenIndex);
			const contents = err.detail.substring(secondOpenParenIndex + 1, secondCloseParenIndex);

			return { columnViolated, contents };
		} else {
			return {
				columnViolated: undefined,
				contents: undefined,
			};
		}
	}
	return undefined;
}
