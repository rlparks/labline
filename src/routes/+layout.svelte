<script lang="ts">
	import { Header } from "$lib/components";
	import "beercss";
	import "./theme.css";
	import ESD from "$lib/images/ESD.png";

	const { children, data } = $props();
</script>

<Header user={data.user} provider={data.ssoProviders?.[0]} />

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
