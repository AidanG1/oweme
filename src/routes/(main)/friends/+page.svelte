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
	import { sesh } from '$lib/auth.svelte'
	import { Badge } from '$lib/components/ui/badge/index.js'

	let { data } = $props()

	const friends = $state(data.friends)
	// const friends = $state(data.requests)
	const prof = data.prof

	async function rejectRequest(id1: string, id2: string) {
		// user needs to be logged in
		if (!sesh.forceGetSession()) {
			return
		}

		if (!sesh.session) {
			return
		}

		const { error: rejectError } = await supabase
			.from('friends')
			.delete()
			.eq('friend_1', id1)
			.eq('friend_2', id2)
		if (rejectError) {
			console.error(rejectError)
			return
		}
	}

	async function acceptRequest(id1: string, id2: string) {
		// user needs to be logged in
		if (!sesh.forceGetSession()) {
			return
		}

		if (!sesh.session) {
			return
		}

		const { data: acceptData, error: acceptError } = await supabase
			.from('friends')
			.update({ accepted: true })
			.eq('friend_1', id1)
			.eq('friend_2', id2)
			.select()

		if (acceptError) {
			console.error(acceptError)
			return
		}
	}

	let input_email: string = $state('')

	async function sendRequest(from_id: string, to_email: string) {
		// user needs to be logged in
		if (!sesh.forceGetSession()) {
			return
		}

		if (!sesh.session) {
			return
		}

		console.log('TO EMAIL: ', to_email)

		// If input is empty, throw error
		if (to_email.length == 0) {
			toasts.addToast({
				type: 'error',
				message: 'Please input an email address'
			})
			return
		}
		// If user is self, throw error
		if (to_email === prof.email) {
			toasts.addToast({
				type: 'error',
				message: 'Cannot send friend request to yourself!'
			})
			return
		}

		// If user exists with corresponding email, send request
		const { data: profilesData, error: profilesError } = await supabase
			.from('profiles')
			.select('*')
			.eq('email', to_email)
			.limit(1)
		if (profilesError) {
			console.log(profilesError)
			return
		}

		// If user with email does not exist, throw toast
		if (profilesData.length == 0) {
			console.log('user dne')
			toasts.addToast({
				type: 'error',
				message: 'User does not exist'
			})
			return
		}

		console.log('user exists')

		// User exists
		const to_id = profilesData[0].id
		console.log('to_id: ', to_id)
		console.log('from:id: ', from_id)

		// If request already exists, throw error
		const { data: requestExistsData, error: requestExistsError } = await supabase
			.from('friends')
			.select(
				`friend_1 (id, venmo, name, email),
                friend_2 (id, venmo, name, email), 
                accepted
        `
			)
			.or(
				`and(friend_1.eq.${to_id},friend_2.eq.${from_id}),and(friend_1.eq.${from_id},friend_2.eq.${to_id})`
			)

		if (requestExistsError) {
			console.log(requestExistsError)
			return
		}
		console.log(requestExistsData)
		if (requestExistsData.length > 0 && !requestExistsData[0].accepted) {
			// Note: friend relationships are limited to only one per pair
			toasts.addToast({
				type: 'error',
				message: 'Request already sent'
			})
			return
		} else if (requestExistsData.length > 0 && requestExistsData[0].accepted) {
			toasts.addToast({
				type: 'error',
				message: 'Already friends!'
			})
			return
		}

		// User exists and no request sent yet, send friend request
		const { data: sendData, error: sendError } = await supabase
			.from('friends')
			.insert({ friend_1: from_id, friend_2: to_id, accepted: false })
			.select()

		if (sendError) {
			console.error(sendError)
			return
		}

		// Reset input field
		to_email = ''

		toasts.addToast({
			type: 'success',
			message: 'Friend request sent!'
		})
	}

	console.log('done send request')

	$inspect(friends)
</script>

<div class="mx-5 mb-0 mt-5 flex w-auto flex-row gap-2 align-middle">
	<Command.Root>
		<div class="max-w-80 grow">
			<Command.Input placeholder="Search for new friends" bind:value={input_email} />
		</div>
	</Command.Root>
	<Button
		on:click={() => {
			sendRequest(prof.id, input_email)
		}}>Request</Button
	>
</div>
<Tabs.Root value="friends">
	<Tabs.List class="mx-5 mt-3 grid w-auto grid-cols-2">
		<Tabs.Trigger value="friends"><a href="/friends">Friends</a></Tabs.Trigger>
		<Tabs.Trigger value="requests">
			<a href="/friends/requests"
				>Requests {#if friends.filter((f) => !f.accepted).length > 0}<Badge
						>{friends.filter((f) => !f.accepted).length}</Badge
					>{/if}</a
			>
		</Tabs.Trigger>
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
						<Button
							on:click={() => {
								rejectRequest(friend.friend_1.id, friend.friend_2.id)
								friends.splice(i, 1)
								toasts.addToast({
									type: 'error',
									message: 'Friend request rejected'
								})
							}}
							variant="destructive">x</Button
						>
						<Button
							on:click={() => {
								acceptRequest(friend.friend_1.id, friend.friend_2.id)
								friend.accepted = true
								toasts.addToast({
									type: 'success',
									message: 'Friend request accepted!'
								})
							}}>o</Button
						>
					</div>
				</div>
			{/if}
		{/each}
	</Tabs.Content>
</Tabs.Root>
