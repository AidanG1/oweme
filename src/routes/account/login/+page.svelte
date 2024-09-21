<script lang="ts">
	import { sesh } from '$lib/auth.svelte'
	import Auth from '$lib/components/Auth.svelte'
</script>

<div>
	{#if sesh.session}
		<h2 class="text-2xl font-bold text-center">
			{#if sesh.session.user.is_anonymous}
				You are logged in anonymously. When you make an online account, your data will be saved.
			{:else}
				You are logged in as {sesh.session.user.email}. You can visit your account page
				<a href="/account" class="underline">here</a>
				or log out
				<a
					href="/account/logout"
					data-sveltekit-preload-code={null}
					data-sveltekit-preload-data={null}
					class="underline">here</a
				>.
			{/if}
		</h2>
	{/if}

	<Auth />
</div>