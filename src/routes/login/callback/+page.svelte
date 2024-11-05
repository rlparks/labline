<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { PROVIDER_KEY } from "$lib";

	let loading = $state(true);

	$effect(() => {});
</script>

<svelte:head>
	<title>knowledger · SSO Callback</title>
	<meta name="description" content="knowledger OIDC callback page. How did you end up here?" />
</svelte:head>

<h3 class="center-align">OIDC Login</h3>
{#if loading}
	<p class="center-align">Logging in...</p>
{:else}
	<p class="center-align">Failed to login. Please try again.</p>
{/if}

<form id="oidcLogin" action="/api/auth/login/oidc" method="POST" use:enhance>
	<input id="providerInput" name="provider" type="hidden" />
	<input id="codeInput" name="code" type="hidden" />
</form>
