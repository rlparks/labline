<script lang="ts">
	import { Header } from "$lib/components";
	import "beercss";
	const { children, data } = $props();
</script>

<Header user={data.user} />

<main class="responsive">
	{@render children()}
</main>
