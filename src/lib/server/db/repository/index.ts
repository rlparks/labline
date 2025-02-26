import DatabaseConnectionError from "$db/errors/DatabaseConnectionError";
import ForeignKeyViolation from "$db/errors/ForeignKeyViolation";
import UniqueConstraintViolation from "$db/errors/UniqueConstraintViolation";
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

	const foreignKeyViolation = parseForeignKeyViolation(err);
	if (foreignKeyViolation) {
		if (foreignKeyViolation.columnViolated) {
			throw new ForeignKeyViolation(
				foreignKeyViolation.table,
				foreignKeyViolation.columnViolated,
				foreignKeyViolation.contents,
			);
		} else {
			throw new ForeignKeyViolation("unknown", "unknown", "unknown");
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
			return parseColumnViolatedAndContents(err.detail);
		} else {
			return {
				columnViolated: undefined,
				contents: undefined,
			};
		}
	}
	return undefined;
}

function parseForeignKeyViolation(err: unknown) {
	if (err instanceof Error && err.message.includes("violates foreign key constraint")) {
		if (
			"detail" in err &&
			typeof err.detail === "string" &&
			err.detail.includes("is not present in table")
		) {
			const columnAndContents = parseColumnViolatedAndContents(err.detail);
			const tableQuoteStartIndex = err.detail.indexOf('"');
			const tableQuoteEndIndex = err.detail.indexOf('"', tableQuoteStartIndex + 1);
			const table = err.detail.substring(tableQuoteStartIndex + 1, tableQuoteEndIndex);

			return { ...columnAndContents, table };
		} else {
			return { table: undefined, columnViolated: undefined, contents: undefined };
		}
	}

	return undefined;
}

function parseColumnViolatedAndContents(detail: string) {
	const firstOpenParenIndex = detail.indexOf("(");
	const firstCloseParenIndex = detail.indexOf(")");

	const secondOpenParenIndex = detail.indexOf("(", firstCloseParenIndex);
	const secondCloseParenIndex = detail.indexOf(")", secondOpenParenIndex);

	const columnViolated = detail.substring(firstOpenParenIndex + 1, firstCloseParenIndex);
	const contents = detail.substring(secondOpenParenIndex + 1, secondCloseParenIndex);

	return { columnViolated, contents };
}
