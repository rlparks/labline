/**
 * Represents the error occurring when the server
 * attempts to connect to a nonexistent database.
 */
export default class DatabaseConnectionError extends Error {
	constructor() {
		super("Error connecting to database");
	}
}
