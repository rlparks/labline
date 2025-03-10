<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();
</script>

<LabsSearch labs={data.labs} title={data.pageTitle} showLabsWhenNoSearch={true} />
