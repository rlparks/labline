<script lang="ts">
	import { Header } from "$lib/components";
	import ESD from "$lib/images/ESD.png";
	import "beercss";
	import "./fonts.css";
	import "./theme.css";

	const { children, data } = $props();
</script>

<noscript>
	<div class="medium middle-align center-align">
		<div>
			<i class="extra">javascript</i>
			<h5 class="center-align">Sorry, JavaScript is required to use this resource</h5>
			<p class="center-align">Please enable JavaScript</p>
		</div>
	</div>
</noscript>

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

	noscript {
		height: 100vh;
	}
</style>
