<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Plus } from 'lucide-svelte'

	interface Item {
		name?: string
		price?: number
	}

	let items: Item[] = $state([{name: "abc" ,price: 123} as Item])
</script>

<div>
	{#each items as item}
		<form class="flex">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="item_name">Item name</Label>
				<Input id="item_name" placeholder="Item name" bind:value={item.name}/>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="price">Price</Label>
				<Input type="number" id="price" placeholder="Price" bind:value={item.price}/>
			</div>
		</form>
	{/each}
	<Button class="" on:click={() => {items.push({name: ""} as Item)}}><Plus /></Button>
</div>
