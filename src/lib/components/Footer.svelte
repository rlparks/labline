<script lang="ts">
	import type { FileStats } from "$lib/types";
	import { Attribution } from ".";

	type Props = {
		fileStats: FileStats | null;
		showDate: boolean;
	};

	const { fileStats, showDate }: Props = $props();

	function formatDate(date: Date) {
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
	}

	const fileSizeKb = fileStats ? (fileStats.stats.sizeBytes / 1024).toFixed(2) : null;
	const atimeDate = fileStats ? new Date(fileStats.stats.atimeMs) : null;
	const mtimeDate = fileStats ? new Date(fileStats.stats.mtimeMs) : null;
	const birthtimeDate = fileStats ? new Date(fileStats.stats.birthtimeMs) : null;
	const lastModified = mtimeDate ? formatDate(mtimeDate) : null;

	function printStats() {
		if (fileStats && atimeDate && mtimeDate && birthtimeDate) {
			console.log(`File name: ${fileStats.fileName}`);
			console.log(`File size: ${fileSizeKb} KB`);
			console.log(`Last accessed: ${formatDate(atimeDate)}`);
			console.log(`Last modified: ${formatDate(mtimeDate)}`);
			console.log(`File created: ${formatDate(birthtimeDate)}`);
		}
	}
</script>

<nav>
	{#if showDate}
		<button id="button-stats" class="chip" onclick={printStats}>
			<i>today</i>
			{#if fileStats}
				<span>{lastModified}</span>
			{:else}
				<span>?</span>
			{/if}
			<div class="tooltip">Last updated</div>
		</button>
	{:else}
		<div></div>
	{/if}
	<div class="max"></div>
	<div id="right">
		<Attribution />
	</div>
</nav>

<style>
	nav {
		@media (max-width: 600px) {
			flex-direction: column;
			justify-content: center;
		}
	}

	nav > button {
		@media (max-width: 600px) {
			margin-top: 10px;
		}
	}

	nav > #right {
		@media (max-width: 600px) {
			margin-bottom: 10px;
		}
	}

	div.max {
		@media (max-width: 600px) {
			display: none;
		}
	}

	#button-stats {
		cursor: help;
	}
</style>
