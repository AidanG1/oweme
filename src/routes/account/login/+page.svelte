<script lang="ts">
	import { goto } from '$app/navigation'
	import { sesh } from '$lib/auth.svelte'
	import Auth from '$lib/components/Auth.svelte'
	import { onMount } from 'svelte'
	onMount(() => {
		if (sesh.session?.user.email) {
			goto('/')
		}
	})
</script>

<div>
	{#if sesh.session}
		<h2 class="text-center text-2xl font-bold">
			{sesh.session.user.email}. You can visit your account page
			<a href="/account" class="underline">here</a>
			or log out
			<a
				href="/account/logout"
				data-sveltekit-preload-code={null}
				data-sveltekit-preload-data={null}
				class="underline">here</a
			>.
		</h2>
	{/if}

	<Auth />
</div>
