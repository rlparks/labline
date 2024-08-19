<!-- 
@component

A card displaying information about a lab. Responsive to screen width.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `lab` | `Lab` | Required | The lab to display. |

## Example

```svelte
<LabCard {lab} />
```

-->

<script lang="ts">
	import type { Lab } from "$lib/types";

	type Props = {
		lab: Lab;
	};
	const { lab }: Props = $props();

	const piName = $derived(`${lab["PI First Name"]} ${lab["PI Last Name"]}`);
	const superName = $derived(`${lab["Super First Name"]} ${lab["Super Last Name"]}`);
</script>

<article class="border">
	<nav>
		<div style="max-width: 100%;">
			<h5><strong>{lab["Lab Name"]}</strong></h5>
			<p>{lab["Bldg Number"]} · {lab["Bldg Name"]}</p>

			<div class="s m">
				{@render contacts()}
			</div>
			<p><strong>Room:</strong> {lab["Room Number"]}</p>
			<p>
				<strong>PI:</strong>
				{piName} · {@render emailLink(lab["PI email"])}
			</p>
			<p><strong>Super:</strong> {superName} · {@render emailLink(lab["Super email"])}</p>
			<p><strong>Container Count:</strong> {lab["Container Count"]}</p>
		</div>
		<div class="max l"></div>
		<div class="l">
			{@render contacts()}
		</div>
	</nav>
</article>

{#snippet emailLink(email: string)}
	<a
		class="link"
		href={`mailto:${email}`}
		data-umami-event="link-email"
		data-umami-event-email={email}>{email}</a
	>
{/snippet}
{#snippet contacts()}
	<div class="right-align-if-l">
		<h6><strong>Primary Contact:</strong></h6>
		<p>{lab["Primary Contact"]}</p>

		<h6><strong>Secondary Contact:</strong></h6>
		<p>{lab["Secondary Contact"]}</p>
	</div>
{/snippet}

<style>
	p {
		text-wrap: balance;
	}

	.right-align-if-l {
		@media (min-width: 993px) {
			text-align: end;
		}
	}
</style>
