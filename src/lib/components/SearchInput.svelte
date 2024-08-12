<!--
@component

A styled search input. The `value` prop should be bound to a state variable.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | (Bindable) The value of the search input. |
| `label` | `string` | Required | The label of the search input, displayed above the input with BeerCSS styling. |

## Example

```svelte
<SearchInput label="Search Labs" bind:value={search} />
```
 -->

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
