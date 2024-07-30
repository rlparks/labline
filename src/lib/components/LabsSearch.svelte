<script lang="ts">
	import { getLabFuse } from "$lib";
	import LabCard from "$lib/components/LabCard.svelte";
	import type { Lab } from "$lib/types/index.js";

	const { labs, title }: { labs: Lab[]; title: string } = $props();

	let search = $state<string>("");

	const fuse = getLabFuse(labs);

	const filteredLabs = $derived(fuse.search<Lab>(search));
	const count = $derived(search ? filteredLabs.length : labs.length);
</script>

{#if labs[0]}
	<h3 class="center-align">{title}</h3>
	<h5 class="center-align">{count === 1 ? "1 lab" : `${count} labs`}</h5>
	<div class="field label border">
		<input id="input-search-labs" bind:value={search} />
		<label for="input-search-labs">Lab Name, Room Number, or Super or PI Name</label>
		<i>search</i>
	</div>
{/if}

{#if !search}
	{#each labs as lab (lab["Lab Name"] + lab["Bldg Number"])}
		<LabCard {lab} />
	{/each}
{:else}
	{#each filteredLabs as lab (lab.item["Lab Name"] + lab.item["Bldg Number"])}
		<LabCard lab={lab.item} />
	{/each}
{/if}
