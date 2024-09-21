<script lang="ts">
	import { Input } from "$lib/components/ui/input"
    import { selectedEmails, selectedFriends } from "$lib/stores.svelte";

    let { data } = $props()

    // let transaction_friends = 

    $inspect(data)


</script>

<!-- there's a search at the top -->
 <!--  for selected friends, they just are in the friends list -->
   <!-- for entered emails, they go near the top -->
<Input type="text" placeholder="Search for friends or enter email" />




<!-- Display friends list -->
{#if data.friends}
    {#each data.friends as row}
        <div>{row.friend1.email}</div>
    {/each}
{/if}