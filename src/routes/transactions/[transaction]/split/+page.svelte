<script lang="ts">
	import { selectedEmails, selectedFriends } from '$lib/stores.svelte'
	import * as Tabs from '$lib/components/ui/tabs'
	import { Trigger } from '$lib/components/ui/drawer'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'

	// print list of people that are involved in this transaction

	// Split the money

	// Add to item_users table
	$selectedEmails.push('a@gmail.com')
	$selectedEmails.push('b@yahoo.com')
	$selectedEmails.push('c@rice.edu')

	let { data } = $props()

	const items = data.items

	interface ItemSplit {
		amount_cents: number
		id: string
		name: string
		transaction: string
		splitters: string[]
	}
	// interface Item_Split {
	//     item: {
	//         id: string;
	//         name: string;
	//         amount_cents: number;
	//         transaction: string;
	//         splitters: string[];
	//     }

	// }
	let items_split: ItemSplit[] = $state(
		items.map((item) => {
            return {
                id: item.id,
                amount_cents: item.amount_cents,
                transaction: item.transaction,
                splitters: []
            }
		})
	)
	console.log(items_split)
</script>

<!-- Different ways to split money -->
<Tabs.Root value="split_itemized">
	<Tabs.List>
		<Tabs.Trigger value="split_equally">Split Equally</Tabs.Trigger>
		<Tabs.Trigger value="split_itemized">Split Itemized</Tabs.Trigger>
		<Tabs.Trigger value="split_exact">Split Exact Amounts</Tabs.Trigger>
		<Tabs.Trigger value="split_percent">Split Percentages</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="split_equally">111</Tabs.Content>
	<Tabs.Content value="split_itemized" class="flex">
		<!-- {#each $selectedEmails as email}
            <div class="flex w-full gap-1.5">
                <Label for="friend_split">{email}</Label>
                <Input id="friend_split" placeholder="$$" required />
            </div>
        {/each} -->
		{#each items_split as item}
			<!-- Display all friends -->
			<div class="flex w-full gap-1.5">
				<Label>{item}</Label>
			</div>
		{/each}
	</Tabs.Content>
	<Tabs.Content value="split_exact">222</Tabs.Content>
	<Tabs.Content value="split_percent">333</Tabs.Content>
</Tabs.Root>
