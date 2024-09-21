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
	<Auth />
</div>
