<script lang="ts">
	import type { FileStats } from "$lib/types";
	import { Attribution } from ".";

	type Props = {
		fileStats: FileStats;
	};

	const { fileStats }: Props = $props();

	function formatDate(date: Date) {
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
	}

	const fileSizeKb = (fileStats.stats.sizeBytes / 1024).toFixed(2);
	const atimeDate = new Date(fileStats.stats.atimeMs);
	const mtimeDate = new Date(fileStats.stats.mtimeMs);
	const birthtimeDate = new Date(fileStats.stats.birthtimeMs);
	const lastModified = formatDate(mtimeDate);

	function printStats() {
		console.log(`File name: ${fileStats.fileName}`);
		console.log(`File size: ${fileSizeKb} KB`);
		console.log(`Last accessed: ${formatDate(atimeDate)}`);
		console.log(`Last modified: ${formatDate(mtimeDate)}`);
		console.log(`File created: ${formatDate(birthtimeDate)}`);
	}
</script>

<nav>
	<button class="chip" onclick={printStats}>
		<i>today</i>
		<span>{lastModified}</span>
		<div class="tooltip">Last updated</div>
	</button>
	<div class="max"></div>
	<div id="right">
		<Attribution />
	</div>
</nav>

<style>
	nav {
		@media (max-width: 600px) {
			flex-direction: column;
		}
	}
</style>
