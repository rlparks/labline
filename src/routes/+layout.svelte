<script lang="ts">
	import { navigating } from "$app/state";
	import { env } from "$env/dynamic/public";
	import { Footer, Header, Message } from "$lib/components";
	import ESD from "$lib/images/ESD.png";
	import "./style/beercss/beer.min.css";
	import "./style/fonts.css";
	import "./style/theme.css";

	const { children, data } = $props();
</script>

<svelte:head>
	<meta name="og:image" content={`${data.requestDomain}/icon/icon-192.png`} />

	{#if env.PUBLIC_UMAMI_ID}
		<script
			defer
			src="https://analytics.esd.uga.edu/script.js"
			data-website-id={env.PUBLIC_UMAMI_ID}
		></script>
	{/if}
</svelte:head>

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

	<Header user={data.user} authInfo={data.authInfo} navLinks={data.navLinks} />

	{@render esdLogo()}

	<main class="responsive">
		{#if !navigating.to}
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
		min-height: 100dvh;
	}

	footer {
		position: sticky;
		top: 100dvh;
	}
</style>
