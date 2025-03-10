<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">Emergency Contacts</h3>

<LabsSearch labs={data.labs} title={data.pageTitle} showLabsWhenNoSearch={false} />
