<script lang="ts">
	import { LabsSearch } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}{data.alias ? ` · ${data.alias.alias}` : ""}</h3>

<LabsSearch labs={data.labs} showLabsWhenNoSearch={true} />
