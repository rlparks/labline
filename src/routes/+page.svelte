<script lang="ts">
	import { Title } from "$lib/components";
	import { fly } from "svelte/transition";

	let moreInfoShown = $state(false);
</script>

<!-- we stack -->
<div class="center-align">
	<Title scale={1.5} />

	<h3>UGA Lab Emergency Contacts</h3>

	<p>
		<i>local_fire_department</i>
	</p>

	<p>When an emergency occurs in a chemical lab, every second matters.</p>

	<p>Labline provides first responders with instant access to critical lab contact information.</p>

	<p>
		Contact the UGA Environmental Safety Division at
		<a class="link" href="mailto:esd@uga.edu">esd@uga.edu</a>
		to gain access.
	</p>

	<p>Select the <i>login</i> Login button in the top right to begin.</p>
	<i>fire_truck</i>

	<div class="space"></div>

	<button class:border={!moreInfoShown} onclick={() => (moreInfoShown = !moreInfoShown)}>
		<i>info</i><span>More Info</span>
	</button>

	{#if moreInfoShown}
		<div transition:fly>
			<div class="space"></div>
			<i>experiment</i>
			<p>
				Every chemical lab at UGA is asked to enter a primary and secondary emergency contact in
				<a class="link" href="https://esd.uga.edu/chematix">Chematix</a>.
			</p>
			<p>Labline exists to make this information accessible quickly and simply.</p>
			<p>
				First responders, such as UGA PD and UGA Office of Research Safety, can search for labs by
				building or search thousands of labs at once.
			</p>
		</div>
	{/if}
</div>

<style>
	p {
		text-wrap: balance;
	}
</style>
