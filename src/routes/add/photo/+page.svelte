<script lang="ts">
	import { chosenPhoto } from '$lib/stores.svelte'
	import { Button } from '$lib/components/ui/button'
</script>

{#if $chosenPhoto}
	<img src={$chosenPhoto} alt="chosen" />
{:else}
	<p class="text-red-500">No photo chosen</p>
{/if}

<Button on:click={() => {}}>Submit picture</Button>
