<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	let { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<form method="POST" use:enhance>
	<Input name="buildingNumber" type="text" autocomplete="off" required label="Building Number" />
	<Input name="alias" type="text" id="name" autocomplete="off" required label="Alias" />

	<button class="no-margin" type="submit" data-umami-event="button-create-alias">Create</button>
</form>
