<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<p class="center-align error-text">{form?.message}</p>
<form method="POST" use:enhance>
	<Input name="buildingNumber" type="text" autocomplete="off" required label="Building Number" />
	<Input name="alias" type="text" id="name" autocomplete="off" required label="Alias" />

	<button class="no-margin" type="submit" data-umami-event="button-create-alias">Create</button>
</form>
