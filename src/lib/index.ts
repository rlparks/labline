// place files you want to import through the `$lib` alias in this folder.

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
	roles: [],
};

/**
 * Formats a `Date` into something nice to look at.
 *
 * @param date the Date to format
 * @returns a nicely formatted date/time string
 */
export function getFormattedDateTime(date: Date): string {
	const dateString = date.toISOString().split("T")[0];
	return `${dateString} ${date.toLocaleTimeString()}`;
}

/**
 * @returns a readable date/time string of the current instant
 */
export function getCurrentFormattedDateTime(): string {
	const now = new Date();
	return getFormattedDateTime(now);
}
