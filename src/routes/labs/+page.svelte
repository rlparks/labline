<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();

	const title = "Search All Labs";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

<LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={false} />
