<script lang="ts">
	import { goto } from '$app/navigation'
	import { sesh } from '$lib/auth.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { supabase } from '$lib/db'
	import { toasts } from '$lib/toasts.svelte'
	import Plus from 'lucide-svelte/icons/plus'
	import X from 'lucide-svelte/icons/x'
	import { slide } from 'svelte/transition'
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

		console.log('submitting transaction')
		console.log(sesh.session)

		// verify that all items have a name and price
		for (let i = 0; i < items.length; i++) {
			if (!items[i].name || !items[i].price) {
				toasts.addToast({
					type: 'error',
					message: 'Please fill out all item names and prices'
				})
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

		goto(`/transactions/${transactionId}/friends`)
	}

	function deleteItem(index: number) {
		items = items.filter((_, i) => i !== index)
	}
</script>

<div class="m-5">
	<form class="mb-5 flex">
		<div class="flex w-full flex-col gap-1.5">
			<Label for="transaction_name">Transaction Name</Label>
			<Input id="transaction_name" required bind:value={transaction_name} />
		</div>
	</form>
	{#each items as item, index (index)}
		<div transition:slide={{ duration: 300 }} class="mb-4">
			<form class="flex items-end">
				<div class="mr-4 flex w-full max-w-sm flex-col gap-1.5">
					<Label for="item_name_{index}">Item name</Label>
					<Input id="item_name_{index}" required bind:value={item.name} />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<div class="flex flex-row">
						<Label for="price_{index}">Price</Label>
						<Button
							variant="destructive"
							class="my-auto mb-0.5 ml-auto h-4 w-4 p-0"
							on:click={() => deleteItem(index)}
							aria-label="Delete item"
						>
							<X class="h-4 w-4" />
						</Button>
					</div>
					<span class="flex items-center gap-1 font-semibold">
						$<Input
							id="item_price_{index}"
							required
							bind:value={item.price}
							type="number"
							min="0.00"
							step="0.01"
						/>
					</span>
				</div>
			</form>
		</div>
	{/each}
	<div class="mt-5 flex flex-row justify-between">
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
			disabled={items.length === 0 || !transaction_name}>Submit Item List</Button
		>
	</div>
</div>
