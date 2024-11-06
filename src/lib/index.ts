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
 * Key used to store OIDC id token in localStorage.
 */
const OIDC_ID_TOKEN_KEY = "oidc_id_token";

/**
 * User used if `BYPASS_ACCOUNT_REQUIREMENT` is set to `true`.
 */
export const DEMO_USER = {
	id: "demo",
	username: "demo",
	name: "Demo User",
};
