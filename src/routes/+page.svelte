<script lang="ts">
	import { Title } from "$lib/components";

	const { data } = $props();
</script>

<svelte:head>
	<title>labline</title>
	<meta name="description" content="Access UGA Lab Emergency Contacts." />
</svelte:head>

<div class="center-align">
	<Title scale={1.5} />
</div>

<h3 class="center-align">UGA Lab Emergency Contacts</h3>

<p class="center-align">When an emergency occurs in a chemical lab, every second matters.</p>

<p class="center-align">
	Labline provides first responders with instant access to critical lab contact information.
</p>

<p class="center-align">
	Contact the UGA Environmental Safety Division at
	<a class="link" href="mailto:esd@uga.edu">esd@uga.edu</a>
	to gain access.
</p>
