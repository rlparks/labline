<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();

	const title = $derived(
		data.labs[0] ? `${data.labs[0]["Bldg Number"]} · ${data.labs[0]["Bldg Name"]}` : "building",
	);
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="UGA Lab Emergency Contacts for {title}." />
</svelte:head>

<LabsSearch labs={data.labs} {title} showLabsWhenNoSearch={true} />
