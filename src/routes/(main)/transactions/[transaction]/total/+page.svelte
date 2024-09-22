<script lang="ts">
	import { page } from '$app/stores'
	import * as Card from '$lib/components/ui/card/index.js'

	let { data, transData } = $page.data.props

	console.log('data here: ', data)

	let food_map = new Map()
	data.forEach((e) => {
		e.item['amount_basis_points'] = e.amount_basis_points
		if (food_map.has(e.email)) {
			let prev = food_map.get(e.email)
			food_map.set(e.email, [...prev, e.item])
		} else {
			food_map.set(e.email, [e.item])
		}
	})
	let total_map = new Map()
	data.forEach((e) => {
		if (total_map.has(e.email)) {
			total_map.set(
				e.email,
				total_map.get(e.email) + ((e.item.amount_basis_points / 10000) * e.item.amount_cents) / 100
			)
		} else {
			total_map.set(e.email, ((e.item.amount_basis_points / 10000) * e.item.amount_cents) / 100)
		}
	})
</script>

<div class="m-5 flex flex-col">
	<p class="mx-auto mb-5 text-lg">{transData.name} Totals</p>
	{#each food_map.keys() as email}
		<Card.Root>
			<Card.Header class="flex flex-row justify-between">
				<Card.Title class="my-auto">{email}</Card.Title>
				<Card.Title class="my-auto">{Number(total_map.get(email)).toFixed(2)}</Card.Title>
			</Card.Header>
			<Card.Content class="">
				{#each food_map.get(email) as item}
					<div class="flex flex-row justify-between">
						<p>{item.name}</p>
						<p>
							{Number(((item.amount_basis_points / 10000) * item.amount_cents) / 100).toFixed(2)}
						</p>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	{/each}
</div>
