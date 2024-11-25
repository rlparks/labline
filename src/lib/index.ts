// place files you want to import through the `$lib` alias in this folder.

/**
 * Database table names.
 */
export const TABLE_NAMES = {
	users: "users",
};

/**
 * Key used to store the OIDC state in sessionStorage.
 */
export const OIDC_STATE_KEY = "oidc_state";

/**
 * User used if `BYPASS_ACCOUNT_REQUIREMENT` is set to `true`.
 */
export const DEMO_USER = {
	id: "demo",
	username: "demo",
	name: "Demo User",
	role: null,
};

export function getFormattedDateTime(date: Date): string {
	const dateString = date.toISOString().split("T")[0];
	return `${dateString} ${date.toLocaleTimeString()}`;
}
