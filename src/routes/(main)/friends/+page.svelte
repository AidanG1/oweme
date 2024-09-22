<!-- this page is for accepted friends -->
<!-- <script lang="ts">
	import { page } from '$app/stores'
	import FriendCard from '$lib/components/FriendCard.svelte';

	let { data, id } = $page.data.props
	console.log('in the page', data)
	let friends = []
	for (let i = 0; i < data.length; i++) {
		if (!data.accepted) {
			continue
		}
		let pair = data[i]
		let friend
		if (pair.friend_1.id === id) {
			friend = pair.friend_2.name
		} else {
			friend = pair.friend_1.name
		}
		friends.push(friend)
	}

	// const getOtherFriend = (friend_1: any, friend_2: any) => {
	// 	if (friend_1.id === sesh.session?.user.id) {
	// 		return friend_2
	// 	} else {
	// 		return friend_1
	// 	}
	// }
</script> -->

<!-- Display friends list -->
<!-- <div class="m-5">
	<FriendCard name="Franklin" />
</div> -->
<!-- {#if data.friends}
	{#each data.friends as row}
		<div>{row.friend_1.email}</div>
	{/each}
{:else}
	<div></div>
{/if} -->

<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import FriendCard from '$lib/components/FriendCard.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { supabase } from '$lib/db.js'
	import { toasts } from '$lib/toasts.svelte'

	let { data } = $props()

	const friends = $state(data.friends)
	// const friends = $state(data.requests)
	const prof = data.prof

	async function rejectRequest(id1: string, id2: string) {
		console.log('reject friend request')
		console.log(id1)
		const { error: rejectError } = await supabase
			.from('friends')
			.delete()
			.eq('friend_1', id1)
			.eq('friend_2', id2)
		if (rejectError) {
			console.error(rejectError)
			return
		}
		console.log('done rejection')
	}

	async function acceptRequest(id1: string, id2: string) {
		console.log('accept friend request')
		console.log("id1: ", id1)
		console.log("id2: ", id2)

		const { data: acceptData, error: acceptError } = await supabase
			.from('friends')
			.update({ 'accepted': true })
			.eq('friend_1', id1)
			.eq('friend_2', id2)
			.select()

		if (acceptError) {
			console.error(acceptError)
			return
		} else {
			console.log(acceptData)
		}
		console.log('done accept')
	}

	$inspect(friends)
</script>

<Command.Root class="mx-5 mb-0 mt-5 w-96 rounded-md border">
	<Command.Input placeholder="Search for new friends" />
</Command.Root>
<Tabs.Root value="friends">
	<Tabs.List class="mx-5 mt-3 grid w-96 grid-cols-2">
		<Tabs.Trigger value="friends"><a href="/friends">Friends</a></Tabs.Trigger>
		<Tabs.Trigger value="requests"><a href="/friends/requests">Requests</a></Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="friends">
		{#each friends as friend}
			{#if friend.friend_1.id != prof.id && friend.accepted}
				<div class="m-5">
					<FriendCard name={friend.friend_1.name} />
				</div>
			{:else if friend.friend_2.id != prof.id && friend.accepted}
				<div class="m-5">
					<FriendCard name={friend.friend_2.name} />
				</div>
			{/if}
		{/each}
	</Tabs.Content>
	<Tabs.Content value="requests">
		{#each friends as friend, i}
			{#if friend.friend_2.id == prof.id && !friend.accepted}
				<div class="flex">
					<div class="m-5 flex flex-grow">
						<FriendCard name={friend.friend_1.name} />
					</div>
					<div class="align-center flex place-items-center gap-4">
						<Button on:click={() => {
							rejectRequest(friend.friend_1.id, friend.friend_2.id)
							friends.splice(i, 1)
							toasts.addToast({
								type: 'error',
								message: 'Friend request rejected'
							})
						}} variant="destructive">x</Button>
						<Button on:click={() => {
							acceptRequest(friend.friend_1.id, friend.friend_2.id)
							friend.accepted = true
							toasts.addToast({
								type: 'success',
								message: 'Friend request accepted!'
							})
							}}>o</Button>
					</div>
				</div>
			{/if}
		{/each}
	</Tabs.Content>
</Tabs.Root>
