<script lang="ts">
	import { Title } from "$lib/components";
	import type { SafeUser } from "$lib/types";

	const {
		user,
	}: {
		user: SafeUser | undefined;
	} = $props();
</script>

<header>
	<nav>
		<Title />
		<div class="max"></div>
		{#if user}
			<button class="">
				<!-- <img class="responsive" src="/favicon.png"> -->
				<i>logout</i>
				<span>Logout</span>
			</button>
		{:else}
			<a class="button" href="/login"> <i>login</i><span>Login</span></a>
		{/if}
	</nav>
</header>
