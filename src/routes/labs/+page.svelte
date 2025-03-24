<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">Emergency Contacts</h3>

<h3 class="center-align">{data.pageTitle}</h3>

<LabsSearch labs={data.labs} showLabsWhenNoSearch={false} />
