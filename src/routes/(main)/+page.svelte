<script lang="ts">
	import { page } from '$app/stores'
	import Feedcard from '$lib/components/feedcard.svelte'
	import * as Command from '$lib/components/ui/command/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { Switch } from '$lib/components/ui/switch/index.js'
	import Users from 'lucide-svelte/icons/users'

	let { payerData, owerData, email } = $page.data.props
	console.log(payerData)
	console.log(owerData)
	interface FeedCardProps {
		name: string
		description: string
		time: Date
		price: number
		incoming: boolean
		resolved: boolean
	}
	let feedcards = []
	for (let i = 0; i < payerData.length; i++) {
		let num = Date.parse(payerData[i].item.transaction.created_at)
		let newDate = new Date(num * 1000)
		let e = payerData[i]
		let price = ((e.amount_basis_points / 10000) * e.item.amount_cents) / 100
		let feedcardProp = {
			name: e.email,
			description: e.item.transaction.name,
			time: newDate,
			price: price,
			incoming: true,
			resolved: false // TODO: check for this
		}
		feedcards.push(feedcardProp)
	}
	for (let i = 0; i < owerData.length; i++) {
		let num = Date.parse(owerData[i].item.transaction.created_at)
		let newDate = new Date(num * 1000)
		let e = owerData[i]
		let price = ((e.amount_basis_points / 10000) * e.item.amount_cents) / 100
		let feedcardProp = {
			name: e.item.transaction.payer.name,
			description: e.item.transaction.name,
			time: newDate,
			price: price,
			incoming: false,
			resolved: false // TODO: check for this
		}
		feedcards.push(feedcardProp)
	}

	// let feedcards = [
	// 	{
	// 		name: 'Franklin',
	// 		description: 'Pizza',
	// 		time: new Date(),
	// 		price: 50.0,
	// 		incoming: true,
	// 		resolved: true
	// 	},
	// 	{
	// 		name: 'Aidan',
	// 		description: 'Vegetable',
	// 		time: new Date(),
	// 		price: 10.0,
	// 		incoming: false,
	// 		resolved: false
	// 	},
	// 	{
	// 		name: 'Nat',
	// 		description: 'Borger',
	// 		time: oneDayAgo,
	// 		price: 50.0,
	// 		incoming: false,
	// 		resolved: false
	// 	},
	// 	{
	// 		name: 'Yimo',
	// 		description: 'Taco',
	// 		time: new Date(),
	// 		price: 20.0,
	// 		incoming: true,
	// 		resolved: false
	// 	}
	// ]

	feedcards.sort((a, b) => {
		// First, sort by resolved status
		if (a.resolved !== b.resolved) {
			return a.resolved ? 1 : -1 // false values come first
		}

		// If resolved status is the same, sort by date
		return b.time.getTime() - a.time.getTime() // latest dates first
	})
</script>

<main>
	<div class="m-5 flex flex-row justify-between">
		<Command.Root class="mr-5 rounded-md border">
			<Command.Input placeholder="Search for transaction..." />
		</Command.Root>
		<div class="flex items-center space-x-2">
			<Switch id="airplane-mode" />
			<Label for="airplane-mode"><Users /></Label>
		</div>
	</div>

	<div class="m-5 flex flex-col">
		{#each feedcards as feedcard}
			<Feedcard {...feedcard} />
		{/each}
	</div>
</main>
