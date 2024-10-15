<script lang="ts">
	import { Attribution } from ".";

	let lastModified: string = "e";
</script>

<nav>
	<div id="left">
		Last updated: {lastModified}
		<div class="tooltip">helo</div>
	</div>
	<div class="max"></div>
	<div id="right">
		<Attribution />
	</div>
</nav>
