<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { Title } from "$lib/components";
	import type { SafeUser } from "$lib/types";
	import type { AuthProviderInfo } from "pocketbase";

	const {
		user,
		provider,
	}: {
		user: SafeUser | undefined;
		provider: AuthProviderInfo | undefined;
	} = $props();

	const oidcRedirectUrl = $derived(
		browser ? `${window.location.origin}/login/callback` : undefined,
	);

	function performRedirect() {
		if (provider) {
			window.sessionStorage.setItem("provider", JSON.stringify(provider));

			window.location.href = provider.authUrl + oidcRedirectUrl;
		} else {
			alert("Error: Provider not found.");
		}
	}

	let width = $state<number>();
</script>

<svelte:window bind:innerWidth={width} />

<header>
	<nav>
		<Title />
		<div class="max"></div>
		{#if user}
			<span>{user.username}</span>
			<form action="/api/auth/logout" method="POST" use:enhance>
				<button type="submit" class={width && width <= 600 ? "circle" : ""}>
					<i>logout</i>
					<span>Logout</span>
				</button>
			</form>
		{:else}
			<button onclick={performRedirect}> <i>login</i><span>Login</span></button>
		{/if}
	</nav>
</header>

<style>
	button {
		margin: 0;
	}
</style>
