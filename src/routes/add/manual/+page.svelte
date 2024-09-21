<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Plus } from 'lucide-svelte'
	import { supabase } from '$lib/db'
	import { sesh } from '$lib/auth.svelte'

	interface Item {
		name?: string
		price?: number
	}

	let items: Item[] = $state([{} as Item])
	let transaction_name: string = $state('')

	const submit_transaction = async () => {
		// user needs to be logged in
		if (!sesh.forceGetSession()) {
			return
		}

		if (!sesh.session) {
			return
		}

		// verify that all items have a name and price
		for (let i = 0; i < items.length; i++) {
			if (!items[i].name || !items[i].price) {
				console.error('Item is missing name or price')
				return
			}
		}

		// Create new transaction
		const { data, error } = await supabase
			.from('transactions')
			.insert({ payer: sesh.session.user.id, name: transaction_name })
			.select()
			.single()

		if (error) {
			console.error(error)
			return
		}

		const transactionId: string = data.id

		const itemsToInsert = items.map((item) => ({
			transaction: transactionId,
			name: item.name,
			amount_cents: item.price * 100
		}))

		const { data: itemsData, error: errorData } = await supabase
			.from('items')
			.insert(itemsToInsert)
			.select()

		if (error) {
			console.error(error)
			return
		}
	}
</script>

<div>
	<form class="flex">
		<div class="flex w-full flex-col gap-1.5">
			<Label for="transaction_name">Transaction name</Label>
			<Input
				id="transaction_name"
				placeholder="Transaction name"
				required
				bind:value={transaction_name}
			/>
		</div>
	</form>
	{#each items as item}
		<form class="flex">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="item_name">Item name</Label>
				<Input id="item_name" placeholder="Item name" required bind:value={item.name} />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="price">Price</Label>
				<Input id="item_price" placeholder="Item price" required bind:value={item.price} />
			</div>
		</form>
	{/each}
	<Button
		class=""
		on:click={() => {
			items.push({} as Item)
		}}
	>
		<Plus />
	</Button>
	<Button
		class=""
		type="submit"
		on:click={submit_transaction}
	>
		Submit
	</Button>
</div>
