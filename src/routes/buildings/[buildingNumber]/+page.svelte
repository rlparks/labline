<script lang="ts">
	import LabCard from "$lib/components/LabCard.svelte";
	import type { Lab } from "$lib/types/index.js";
	import Fuse from "fuse.js";

	const { data } = $props();

	let search = $state<string>("");

	const fuse = new Fuse(data.labs, {
		keys: [
			"Lab Name",
			"PI First Name",
			"PI Last Name",
			"Super First Name",
			"Super Last Name",
			"Room Number",
		],
	});

	const filteredLabs = $derived(fuse.search<Lab>(search));
	const title = $derived(
		data.labs[0] ? `${data.labs[0]["Bldg Number"]} · ${data.labs[0]["Bldg Name"]}` : "building",
	);
	const count = $derived(search ? filteredLabs.length : data.labs.length);
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

{#if data.labs[0]}
	<h3 class="center-align">{title}</h3>
	<h5 class="center-align">{count === 1 ? "1 lab" : `${count} labs`}</h5>
	<div class="field label border">
		<input id="input-search" bind:value={search} />
		<label for="input-search">Lab Name, Room Number, or Super or PI Name</label>
		<i>search</i>
	</div>
{/if}

{#if !search}
	{#each data.labs as lab (lab["Lab Name"])}
		<LabCard {lab} />
	{/each}
{:else}
	{#each filteredLabs as lab (lab.item["Lab Name"])}
		<LabCard lab={lab.item} />
	{/each}
{/if}
