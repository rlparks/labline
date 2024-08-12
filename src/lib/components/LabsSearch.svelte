<!-- 
 @component
 
 A searchable list of `Lab`s.

 ## Props
 
 | Name | Type | Default | Description |
 | --- | --- | --- | --- |
 | `labs` | `Lab[]` | Required | The labs to display. |
 | `title` | `string` | Required | The title of the search. |
 | `showLabsWhenNoSearch` | `boolean` | Required | Whether to show all labs when no search is applied. |

 ## Example
 
 ```svelte
 <LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={false} />
 ```
  -->

<script lang="ts">
	import { FuzzyLabSearch } from "$lib/search/FuzzyLabSearch";
	import type { Lab } from "$lib/types";
	import { Message, LabCard, SearchInput } from "$lib/components";

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
	<SearchInput label="Lab Name, Room Number, Super/PI" bind:value={search} />
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
