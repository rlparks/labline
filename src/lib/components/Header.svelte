<!-- 
@component

The header (navigation bar) of the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `SafeUser \| undefined` | Required | The current user, displayed in the header. |
| `provider` | `AuthProviderInfo \| undefined` | Required | The provider to use for OIDC login. |

## Example

```svelte
<Header {user} {provider} />
```

-->

<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { OIDC_STATE_KEY } from "$lib";
	import { Title } from "$lib/components";
	import type { AuthInfo, SafeUser } from "$lib/types";

	type Props = {
		user: SafeUser | null;
		authInfo: AuthInfo;
		navLinks: { href: string; text: string; icon: string }[];
	};

	const { user, authInfo, navLinks }: Props = $props();

	const navBreakpoint = 287 * navLinks.length;
	const buttonCircleBreakpoint = 200 * navLinks.length;

	const oidcRedirectUrl = $derived(
		browser ? `${window.location.origin}/login/callback` : undefined,
	);

	function performRedirect() {
		if (authInfo.authEndpoint && oidcRedirectUrl) {
			window.sessionStorage.setItem(OIDC_STATE_KEY, authInfo.state);

			const authEndpointUrl = new URL(authInfo.authEndpoint);
			authEndpointUrl.searchParams.set("redirect_uri", oidcRedirectUrl);
			window.location.href = authEndpointUrl.toString();
		} else {
			alert("Error: Provider not found.");
		}
	}

	let width = $state<number>(navBreakpoint + 1);
</script>

<svelte:window bind:innerWidth={width} />

<header>
	<nav>
		<Title />
		{#if user && width && width > navBreakpoint}
			{@render navButtons()}
		{/if}
		<div class="max"></div>
		{#if user}
			<span>{user.name}</span>
			<form action="/api/auth/logout" method="POST" use:enhance>
				<button
					type="submit"
					class:circle={width && width <= buttonCircleBreakpoint}
					data-umami-event="button-logout"
					data-umami-event-username={user.username}
				>
					<i>logout</i>
					<span>Logout</span>
				</button>
			</form>
		{:else}
			<button onclick={performRedirect} data-umami-event="button-login">
				<i>login</i><span>Login</span>
			</button>
		{/if}
	</nav>

	{#if user && width && width <= navBreakpoint}
		<div class="row center-align no-margin">
			{@render navButtons()}
		</div>
	{/if}
</header>

{#snippet navButtons()}
	{#each navLinks as link}
		{@render navButton(link.href, link.icon, link.text)}
	{/each}
{/snippet}

{#snippet navButton(url: string, icon: string, text: string)}
	<a
		class="button"
		class:border={page.url.pathname !== url}
		class:circle={width && width <= buttonCircleBreakpoint && page.url.pathname !== url}
		href={url}
		><i>{icon}</i>
		{#if (width && width > buttonCircleBreakpoint) || page.url.pathname === url}
			<span>{text}</span>{/if}</a
	>
{/snippet}

<style>
	button {
		margin: 0;
	}
</style>
