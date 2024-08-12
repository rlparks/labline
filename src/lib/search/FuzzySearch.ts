import Fuse, { type FuseResult } from "fuse.js";

/**
 * General fuzzy search class. Uses Fuse.js.
 * @param {T[]} items the items to search
 * @template T the type of the items
 */
export abstract class FuzzySearch<T> {
	protected abstract fuse: Fuse<T>;
	protected static FUSE_SEARCH_OPTIONS = { limit: 300 };

	/**
	 * Create a searcher.
	 *
	 * @param items the items to search
	 */
	constructor(items: T[]) {
		if (items.length === 0) {
			throw new Error("No items to search");
		}
	}

	/**
	 * Search for items.
	 *
	 * @param searchTerm the search term
	 * @returns the search results
	 */
	abstract search(searchTerm: string): FuseResult<T>[];
}
