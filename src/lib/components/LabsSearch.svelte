<script lang="ts">
	import { Input, LabCard, Message } from "$lib/components";
	import { FuzzyLabSearch } from "$lib/search/FuzzyLabSearch";
	import type { Lab } from "$lib/types";
	import { slide } from "svelte/transition";

	type Props = {
		labs: Lab[];
		showLabsWhenNoSearch: boolean;
	};
	const { labs, showLabsWhenNoSearch }: Props = $props();

	let search = $state<string>("");
	let debouncedSearch = $state<string>("");
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	const debounceMs = 300;

	function handleSearchInput() {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = setTimeout(() => {
			debouncedSearch = search;
			debounceTimeout = null;
		}, debounceMs);
	}

	const searcher = new FuzzyLabSearch(labs);

	const filteredLabs = $derived(searcher.search(debouncedSearch));
	const count = $derived(debouncedSearch ? filteredLabs.length : labs.length);
	const countText = $derived(count === 1 ? "1 lab" : `${count} labs`);

	const labsAreShown = $derived(debouncedSearch || showLabsWhenNoSearch);
</script>

{#if labs[0]}
	{#if labsAreShown}
		<h3 transition:slide class="center-align">{countText}</h3>
	{/if}
	<Input
		label="Lab Name, Room Number, Super/PI"
		icon="search"
		bind:value={search}
		oninput={() => handleSearchInput()}
	/>
{/if}

{#if search === debouncedSearch}
	{#if !debouncedSearch}
		{#if showLabsWhenNoSearch}
			{#each labs as lab (lab["Lab Name"] + lab["Bldg Number"])}
				<LabCard {lab} />
			{/each}
		{:else}
			<Message
				iconText="experiment"
				headerText="No labs found"
				messageText="Try searching using a lab name, room number, or the name of the supervisor or PI"
			/>
		{/if}
	{:else}
		{#each filteredLabs as lab (lab.item["Lab Name"] + lab.item["Bldg Number"])}
			<LabCard lab={lab.item} />
		{/each}
	{/if}
{:else}
	<!-- if search doesn't equal debouncedSearch, we're currently waiting on the debounce timeout -->
	<Message
		iconText="pending"
		headerText="Searching..."
		messageText="Filtering {labs.length} labs"
	/>
{/if}
