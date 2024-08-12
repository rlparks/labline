<script lang="ts">
	import { Header, Message } from "$lib/components";
	import ESD from "$lib/images/ESD.png";
	import "beercss";
	import "./fonts.css";
	import "./theme.css";

	const { children, data } = $props();
</script>

<noscript>
	<div class="space"></div>
	<Message
		iconText="javascript"
		headerText="Sorry, JavaScript is required to use this site"
		messageText="Please enable JavaScript"
	/>
	<div class="space"></div>
</noscript>

<Header user={data.user} provider={data.ssoProvider} />

<div class="center-align">
	<div class="space"></div>
	<img width="400px" class="" src={ESD} alt="ESD" />
	<div class="space"></div>
</div>

<main class="responsive">
	{@render children()}
</main>

<style>
	@media (max-width: 600px) {
		img {
			width: 300px;
		}
	}
</style>
