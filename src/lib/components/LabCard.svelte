<script lang="ts">
	import type { Lab } from "$lib/types";

	type Props = {
		lab: Lab;
	};
	const { lab }: Props = $props();
</script>

<article class="border">
	<nav>
		<div>
			<h5>{lab["Lab Name"]}</h5>
			<p>{lab["Room Number"]}</p>
		</div>
	</nav>
</article>
