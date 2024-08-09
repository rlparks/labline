<script lang="ts">
	import { FuzzyLabSearch } from "$lib/search/FuzzyLabSearch";
	import type { Lab } from "$lib/types/index.js";
	import { Message, LabCard } from "$lib/components";

	type Props = {
		labs: Lab[];
		title: string;
		showLabsWhenNoSearch: boolean;
	};
	const { labs, title, showLabsWhenNoSearch }: Props = $props();

	let search = $state<string>("");

	const searcher = new FuzzyLabSearch(labs);

	const filteredLabs = $derived(searcher.search(search));
	const count = $derived(search ? filteredLabs.length : labs.length);
	const countText = $derived(count === 1 ? "1 lab" : `${count} labs`);

	const labsAreShown = $derived(search || showLabsWhenNoSearch);
</script>

{#if labs[0]}
	<h3 class="center-align">{title}{labsAreShown ? ` · ${countText}` : ""}</h3>
	<div class="field label border">
		<input id="input-search-labs" bind:value={search} />
		<label for="input-search-labs">Lab Name, Room Number, Super/PI</label>
		<i>search</i>
	</div>
{/if}

{#if !search}
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
