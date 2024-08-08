<script lang="ts">
	import { Header } from "$lib/components";
	import "beercss";
	import "./theme.css";
	import "./fonts.css";
	import ESD from "$lib/images/ESD.png";
	import { browser } from "$app/environment";

	const { children, data } = $props();

	if (browser) {
		const main = document.getElementsByTagName("main").item(0);
		if (main) main.style.display = "block";
	}
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

<noscript>
	<div class="medium middle-align center-align">
		<div>
			<i class="extra">javascript</i>
			<h5 class="center-align">Sorry, JavaScript is required to use this resource</h5>
			<p class="center-align">Please enable JavaScript</p>
		</div>
	</div>
</noscript>

<style>
	@media (max-width: 600px) {
		img {
			width: 300px;
		}
	}

	main {
		display: none;
	}
</style>
