<script lang="ts">
	import Feedcard from '$lib/components/feedcard.svelte'
	import * as Command from '$lib/components/ui/command/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { Switch } from '$lib/components/ui/switch/index.js'
	import { Users } from 'lucide-svelte'

	// let { data } = $props()
	let oneDayAgo = new Date()
	oneDayAgo.setDate(oneDayAgo.getDate() - 1)
	let feedcards = [
		{
			name: 'Franklin',
			description: 'Pizza',
			time: new Date(),
			price: 50.0,
			incoming: true,
			resolved: true
		},
		{
			name: 'Aidan',
			description: 'Vegetable',
			time: new Date(),
			price: 10.0,
			incoming: false,
			resolved: false
		},
		{
			name: 'Nat',
			description: 'Borger',
			time: oneDayAgo,
			price: 50.0,
			incoming: false,
			resolved: false
		},
		{
			name: 'Yimo',
			description: 'Taco',
			time: new Date(),
			price: 20.0,
			incoming: true,
			resolved: false
		}
	]

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
		<Command.Root class="mr-5 w-72 rounded-md border">
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
