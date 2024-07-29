<script lang="ts">
	import type { Building } from "$lib/types";

	type Props = {
		building: Building;
	};
	const { building }: Props = $props();
</script>

<article class="border">
	<nav>
		<div>
			<h5>{building.name}</h5>
			<p>{building.number}</p>
		</div>
		<div class="max"></div>
		<div id="link" class="right-align">
			<a href={`/buildings/${building.number}`} class="button">Go</a>
		</div>
	</nav>
</article>

<style>
	a {
		margin: 0;
	}
	@media (max-width: 600px) {
		nav {
			display: block;
		}
	}
</style>
