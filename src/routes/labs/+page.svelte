<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();

	const title = "Search All Labs";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>
<div class="space"></div>

<div class="center-align">
	<a class="button" href="/">Search by Building</a>
</div>

<LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={false} />
