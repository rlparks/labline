import Fuse, { type FuseResult } from "fuse.js";

export abstract class FuzzySearch<T> {
	protected abstract fuse: Fuse<T>;
	protected static FUSE_SEARCH_OPTIONS = { limit: 300 };

	constructor(items: T[]) {
		if (items.length === 0) {
			throw new Error("No items to search");
		}
	}

	abstract search(searchTerm: string): FuseResult<T>[];
}
