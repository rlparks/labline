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
</script>

<nav>
	<div id="left">
		Last updated: {lastModified}
		<div class="tooltip right max">
			<p>File name: {fileStats.fileName}</p>
			<p>File size: {fileSizeKb} KB</p>
			<p>Last accessed: {formatDate(atimeDate)}</p>
			<p>File created: {formatDate(birthtimeDate)}</p>
		</div>
	</div>
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
