<script lang="ts">
	import type { Lab } from "$lib/types";

	type Props = {
		lab: Lab;
		showBuildingName: boolean;
	};
	const { lab, showBuildingName }: Props = $props();
</script>

<article class="border">
	<nav>
		<div>
			<h5>{lab["Lab Name"]}</h5>
			{#if showBuildingName}
				<p>{lab["Bldg Number"]} · {lab["Bldg Name"]}</p>
			{/if}
			<p>{lab["Room Number"]}</p>
		</div>
	</nav>
</article>
