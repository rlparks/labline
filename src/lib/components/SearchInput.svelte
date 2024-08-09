<script lang="ts">
	type Props = {
		value: string;
		label: string;
	};
	let { value = $bindable(), label }: Props = $props();
</script>

<div class="field label border">
	<input id="input-search-labs" bind:value />
	<label for="input-search-labs">{label}</label>
	<i>search</i>
</div>
