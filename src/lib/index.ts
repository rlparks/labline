// place files you want to import through the `$lib` alias in this folder.

/**
 * Database table names.
 */
export const TABLE_NAMES = {
	users: "users",
};

/**
 * Key used to store the OIDC provider in SessionStorage.
 */
export const PROVIDER_KEY = "provider";

/**
 * User used if `BYPASS_ACCOUNT_REQUIREMENT` is set to `true`.
 */
export const DEMO_USER = {
	id: "demo",
	username: "demo",
	name: "Demo User",
};
