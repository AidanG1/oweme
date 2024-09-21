<script lang="ts">
	import Feedcard from '$lib/components/feedcard.svelte'
	import { Input } from '$lib/components/ui/input/index.js'

	// let { data } = $props()
	let feedcards = [
		{
			name: 'Franklin',
			description: 'Pizza',
			time: Date.now(),
			price: '50.00',
			incoming: true,
			resolved: true
		},
		{
			name: 'Nat',
			description: 'Borger',
			time: Date.now() - 20,
			price: '50.00',
			incoming: true,
			resolved: true
		}
	]
	// for ()
</script>

<main>
	<Input type="search" class="m-5 w-72" />

	<div class="m-5 flex flex-col">
		<Feedcard />
	</div>
</main>
