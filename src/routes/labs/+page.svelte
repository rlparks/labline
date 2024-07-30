<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();

	const title = "All Labs";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

<div class="center-align">
	<a class="button" href="/">Search by Building</a>
</div>

<LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={false} />
