<script lang="ts">
	import { Message, BuildingCard, SearchInput } from "$lib/components";
	import { FuzzyBuildingSearch } from "$lib/search/FuzzyBuildingSearch";

	const { data } = $props();

	let search = $state<string>("");

	const searcher = new FuzzyBuildingSearch(data.buildings);

	const filteredBuildings = $derived(searcher.search(search));
</script>

<svelte:head>
	<title>knowledger</title>
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

<div class="space"></div>

<div class="center-align">
	<a class="button" href="/labs" data-umami-event="link-search-all-labs">Search All Labs</a>
</div>

<h3 class="center-align">Search by Building</h3>

<SearchInput label="Building Name or Number" bind:value={search} />

{#each filteredBuildings as building (building.item.number)}
	<BuildingCard building={building.item} />
{/each}

{#if filteredBuildings.length === 0}
	<Message
		iconText="domain"
		headerText="No buildings found"
		messageText="Try searching using a building name or number"
	/>
{/if}
