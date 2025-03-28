<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = {
		value?: string;
		label: string;
		icon?: string;
	} & HTMLInputAttributes;
	// "let" because of bindable
	let { value = $bindable(""), label, icon, ...rest }: Props = $props();

	const inputId = $props.id();
</script>

<div class="field label border">
	<input class:active={value} id={inputId} bind:value {...rest} />
	<label class:active={value} for={inputId}>{label}</label>
	{#if icon}
		<i>{icon}</i>
	{/if}
</div>
