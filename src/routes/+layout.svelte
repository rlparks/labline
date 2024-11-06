<script lang="ts">
	import { Footer, Header, Message } from "$lib/components";
	import ESD from "$lib/images/ESD.png";
	import "beercss";
	import "./fonts.css";
	import "./theme.css";
	import { navigating } from "$app/stores";

	const { children, data } = $props();
</script>

<div class="content">
	<noscript>
		<div class="space"></div>
		<Message
			iconText="javascript"
			headerText="Sorry, JavaScript is required to use this site"
			messageText="Please enable JavaScript"
		/>
		<div class="space"></div>
	</noscript>

	<Header user={data.user} authEndpoint={new URL(data.ssoAuthUrl)} />

	{@render esdLogo()}

	<main class="responsive">
		{#if !$navigating}
			{@render children()}
		{:else}
			<div class="space"></div>
			<Message
				iconText="sync"
				headerText="Please wait..."
				messageText="Retrieving data from server"
			/>
			<div class="space"></div>
		{/if}
	</main>

	<div class="space"></div>

	<footer>
		<Footer fileStats={data.fileStats} showDate={Boolean(data.user)} />
	</footer>
</div>

{#snippet esdLogo()}
	<div class="center-align">
		<div class="space"></div>
		<img width="400px" class="" src={ESD} alt="ESD" />
		<div class="space"></div>
	</div>
{/snippet}

<style>
	@media (max-width: 600px) {
		img {
			width: 300px;
		}
	}

	/* https://reddit.com/r/sveltejs/comments/16904vm/place_footer_at_end_of_page/jz0ho59/ */
	.content {
		min-height: 100vh;
	}

	footer {
		position: sticky;
		top: 100vh;
	}
</style>
