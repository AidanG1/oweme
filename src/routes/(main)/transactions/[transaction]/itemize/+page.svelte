<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import { Button } from '$lib/components/ui/button/index.js'
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import Label from '$lib/components/ui/label/label.svelte'
	import { Progress } from '$lib/components/ui/progress/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { supabase } from '$lib/db'
	import { selectedEmails } from '$lib/stores.svelte'

	let { data } = $props()

	const items = data.items

	interface OwerActivity {
		email: string
		name?: string
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
		$selectedEmails.map((e) => {
			return {
				email: e.email,
				name: e.name
			}
		})
	)

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
				let r = Math.floor(Math.random() * item.splitters.length)
				if (rand_add.indexOf(r) === -1) {
					rand_add.push(r)
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

	let api: CarouselAPI | undefined = $state()
	let currSelected = $state(0)

	// stuff happens everytime something changes in the thing
	$effect(() => {
		if (api) {
			api.on('select', (e) => {
				// console.log(e.slidesInView())
				currSelected = api?.selectedScrollSnap()!

				console.log('changed carousel things')
				console.log(api?.selectedScrollSnap())
				// do something on select
			})
		}
	})
	console.log(api?.selectedScrollSnap())
	console.log(owers)
	let num_separators = items_split.length - 1
	let separator_num = 0
	let increment_sep_num = () => {
		separator_num++
	}
	let val = 1
</script>

<!-- <div class="m-20 w-full"> -->
<Carousel.Root bind:api class="m-auto flex h-20 w-96 items-center justify-center">
	<Carousel.Content>
		{#each owers as ower}
			<Carousel.Item>
				<Carousel.Content class="relative z-10 flex h-full items-center justify-center">
					<div class="flex w-72 flex-col">
						<Avatar.Root class="mx-auto">
							<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn img" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<p class="mx-auto">{ower.name ? ower.name : ower.email}</p>
					</div>
				</Carousel.Content>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous class="absolute left-0 z-20" />
	<Carousel.Next class="absolute right-0 z-20" />
</Carousel.Root>
<Progress value={currSelected + 1} max={owers.length} class="rounded-none" />
<Separator />
<div class="m-5 flex flex-col gap-3">
	{#each items_split as item, i}
		<div class="flex w-full gap-1.5">
			<Checkbox
				id="items-label-{i}"
				checked={item.splitters.map((pers) => pers.email).includes(owers[currSelected].email)}
				onCheckedChange={(e) => {
					if (e) {
						item.splitters.push({ email: owers[currSelected].email })
					} else {
						item.splitters = item.splitters.filter(
							(splitter) => splitter.email !== owers[currSelected].email
						)
					}
				}}
				aria-labelledby="items-label"
			/>
			<Label
				id="items"
				for="items-label-{i}"
				class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{item.name}
			</Label>
		</div>
		<!-- this is the most disgusting thing i've done in my life -->
		{#if separator_num < num_separators}
			<Separator />
			{increment_sep_num()}
		{/if}
	{/each}
	<div class="flex">
		<Button on:click={submit_itemization} class="mx-auto">Submit</Button>
	</div>
</div>
<!-- </div> -->
<!-- <h2>Itemize Receipt</h2>
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
		 View from pov one friend 
		{#each items_split as item}
			 Display all items 
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
				</Label>
			</div>
		{/each}
	{/if}
{/each} -->
