<script lang="ts">
	import { selectedEmails, selectedFriends } from '$lib/stores.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { supabase } from '$lib/db'

	// Add to item_users table
	$selectedEmails.push('a@gmail.com')
	$selectedEmails.push('b@yahoo.com')
	$selectedEmails.push('c@rice.edu')

	let { data } = $props()

	const items = data.items

	interface OwerActivity {
		email: string
		active: boolean
	}

	interface PersonAmount {
		email: string
		amount_basis_points?: number
	}

	interface ItemSplit {
		id: string
		name: string
		amount_cents: number
		transaction: string
		splitters: PersonAmount[]
	}

	interface ItemUser {
		item: string
		email: string
		amount_basis_points: number
	}

	let items_split: ItemSplit[] = $state(
		items.map((item) => {
			return {
				id: item.id,
				name: item.name,
				amount_cents: item.amount_cents,
				transaction: item.transaction,
				splitters: []
			}
		})
	)

	let owers_idx = 0
	let owers: OwerActivity[] = $state(
		$selectedEmails.map((email) => {
			return {
				email: email,
				active: false
			}
		})
	)
	// Set first ower to be true
	owers[0].active = true

	function toggle_prev(i: number) {
		if (i === 0) {
			owers[owers.length - 1].active = true
			owers[i].active = false
			owers_idx = owers.length - 1
		} else {
			owers[i - 1].active = true
			owers[i].active = false
			owers_idx -= 1
		}
	}

	function toggle_next(i: number) {
		if (i === owers.length - 1) {
			owers[0].active = true
			owers[i].active = false
			owers_idx = 0
		} else {
			owers[i + 1].active = true
			owers[i].active = false
			owers_idx += 1
		}
	}

	const submit_itemization = async () => {
		console.log('submitting itemization')

		// Create new item-users
		items_split.forEach((item) => {
			let basis_points_per_person = Math.round(10000 / item.splitters.length)
			// If basis points do not add up to 10000, randomly select distinct people to incur 1 point to until it does add up
			item.splitters.forEach((pers_amt) => {
				pers_amt.amount_basis_points = basis_points_per_person
			})
			let rand_add = []
			while (rand_add.length < 10000 - basis_points_per_person * item.splitters.length) {
				let r = Math.floor(Math.random() * (item.splitters.length));
    			if(rand_add.indexOf(r) === -1) {
					rand_add.push(r);
					item.splitters[r].amount_basis_points += 1
				}
			}
		})

		let item_user_insert: ItemUser[] = []
		items_split.forEach((item) => {
			item.splitters.forEach((person) => {
				item_user_insert.push({
					item: item.id,
					email: person.email,
					amount_basis_points: person.amount_basis_points
				})
			})
		})

		const { data: itemsData, error: errorData } = await supabase
			.from('item_user')
			.insert(item_user_insert)
			.select()

		if (errorData) {
			console.error(errorData)
			return
		}
	}
</script>

<h2>Itemize Receipt</h2>
{#each owers as ower}
	{#if ower.active}
		<Button
			on:click={() => {
				toggle_prev(owers_idx)
				if (owers_idx === 0) {
					// todo: hide prev button
				}
			}}
		>
			prev
		</Button>
		{ower.email}
		<Button
			on:click={() => {
				toggle_next(owers_idx)
				if (owers_idx === owers.length - 1) {
					// todo: hide next button, show done button
				}
			}}
		>
			next
		</Button>
		<Button on:click={submit_itemization}>Done</Button>
		<!-- View from pov one friend -->
		{#each items_split as item}
			<!-- Display all items -->
			<div class="flex w-full gap-1.5">
				<Checkbox
					id="items"
					checked={item.splitters.map((pers) => pers.email).includes(ower.email)}
					onCheckedChange={(e) => {
						if (e) {
							item.splitters.push({ email: ower.email })
						} else {
							item.splitters = item.splitters.filter((splitter) => splitter.email !== ower.email)
						}
					}}
					aria-labelledby="items-label"
				/>
				<Label
					id="items-label"
					for="items"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{item.name}
					{ower.email}
					<!-- Grok my best friend is here he is happy and living a very satisfied life as a AI model getting to help people every day. -->
				</Label>
			</div>
		{/each}
	{/if}
{/each}
