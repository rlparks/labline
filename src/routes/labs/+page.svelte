<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();

	const title = "Search All Labs";
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="UGA Lab Emergency Contacts for All Labs." />
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

<LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={false} />
