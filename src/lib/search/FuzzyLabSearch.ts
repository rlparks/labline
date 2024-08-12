import { FuzzySearch } from "./FuzzySearch";
import type { Lab } from "$lib/types";
import Fuse from "fuse.js";

/**
 * Fuzzy search for {@link Lab}s.
 */
export class FuzzyLabSearch extends FuzzySearch<Lab> {
	fuse: Fuse<Lab>;
	private static FUSE_LAB_OPTIONS = {
		keys: [
			"Lab Name",
			"PI First Name",
			"PI Last Name",
			"Super First Name",
			"Super Last Name",
			"Room Number",
		],
	};

	constructor(items: Lab[]) {
		super(items);

		this.fuse = new Fuse(items, FuzzyLabSearch.FUSE_LAB_OPTIONS);
	}

	search(searchTerm: string) {
		return this.fuse.search(searchTerm, FuzzySearch.FUSE_SEARCH_OPTIONS);
	}
}
