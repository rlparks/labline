<script lang="ts">
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>knowledger · {$page.status}</title>
</svelte:head>

{#if $page.status === 401}
	<div class="medium middle-align center-align">
		<div>
			<i class="extra">no_accounts</i>
			<h5 class="center-align">An account is required to access this resource</h5>
			<p class="center-align">Try logging in with your UGA account</p>
		</div>
	</div>
{:else}
	<h3 class="center-align">{$page.status}: {$page.error?.message}</h3>
{/if}

<style>
	h5 {
		text-wrap: balance;
	}
</style>
