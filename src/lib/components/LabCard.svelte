<script lang="ts">
	import type { Lab } from "$lib/types";

	type Props = {
		lab: Lab;
		showBuildingName: boolean;
	};
	const { lab, showBuildingName }: Props = $props();

	const piName = $derived(`${lab["PI First Name"]} ${lab["PI Last Name"]}`);
	const superName = $derived(`${lab["Super First Name"]} ${lab["Super Last Name"]}`);
</script>

<article class="border">
	<nav>
		<div>
			<h5>{lab["Lab Name"]}</h5>
			{#if showBuildingName}
				<p>{lab["Bldg Number"]} · {lab["Bldg Name"]}</p>
			{/if}
			<p><strong>Room:</strong> {lab["Room Number"]}</p>
			<p>
				<strong>PI:</strong>
				{piName} · {@render emailLink(lab["PI email"])}
			</p>
			<p><strong>Super:</strong> {superName} · {@render emailLink(lab["Super email"])}</p>
			<p><strong>Container Count:</strong> {lab["Container Count"]}</p>
			<div class="s m">
				{@render contacts()}
			</div>
		</div>
		<div class="max l"></div>
		<div class="l">
			{@render contacts()}
		</div>
	</nav>
</article>

{#snippet emailLink(email: string)}
	<a class="link" href={`mailto:${email}`}>{email}</a>
{/snippet}
{#snippet contacts()}
	<strong>Primary Contact:</strong>
	<p>{lab["Primary Contact"]}</p>
	<strong>Secondary Contact:</strong>
	<p>{lab["Secondary Contact"]}</p>
{/snippet}
