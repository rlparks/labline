/**
 * Represents the error occurring when the server
 * attempts to connect to a nonexistent database.
 */
export class DatabaseConnectionError extends Error {
	constructor() {
		super();
	}
}
