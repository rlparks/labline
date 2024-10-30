<script lang="ts">
	import { LabsSearch, Message } from "$lib/components";

	const { data } = $props();

	const title = "Search All Labs";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

{#await data.labs}
	<div class="space"></div>
	<Message iconText="sync" headerText="Please wait" messageText="Retrieving labs from server..." />
{:then labs}
	<LabsSearch {labs} {title} showLabsWhenNoSearch={false} />
{/await}
