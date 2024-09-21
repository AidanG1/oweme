<!-- this page is for accepted friends -->
<script lang="ts">
    import { sesh } from "$lib/auth.svelte";
	import type { Tables } from "$lib/supabase.types"


	let { data } = $props()

	$inspect(data)

    const getOtherFriend = (friend_1: Tables<'profiles'>, friend_2: Tables<'profiles'>) => {
        if (friend_1.id === sesh.session?.user.id) {
            return friend_2
        } else {
            return friend_1
        }
    }
</script>

<!-- <!-- Display friends list --> -->
{#if data.friends}
	{#each data.friends as row}
		<div>{row.friend_1.email}</div>
	{/each}
{:else}
	<div></div>
{/if}
