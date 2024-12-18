<script lang="ts">
	import { Title } from "$lib/components";

	const { data } = $props();

	let moreInfoShown = $state(false);
</script>

<svelte:head>
	<title>labline</title>
	<meta name="description" content="Access UGA Lab Emergency Contacts." />
</svelte:head>

<!-- we stack -->
<div class="center-align">
	<Title scale={1.5} />

	<h3>UGA Lab Emergency Contacts</h3>

	<p>When an emergency occurs in a chemical lab, every second matters.</p>

	<p>Labline provides first responders with instant access to critical lab contact information.</p>

	<p>
		Contact the UGA Environmental Safety Division at
		<a class="link" href="mailto:esd@uga.edu">esd@uga.edu</a>
		to gain access.
	</p>

	<p>Select the <i>login</i> Login button in the top right to begin.</p>

	<button class:border={!moreInfoShown} onclick={() => (moreInfoShown = !moreInfoShown)}>
		<i>info</i>More Info
	</button>
</div>
