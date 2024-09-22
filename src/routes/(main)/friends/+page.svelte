<!-- this page is for accepted friends -->
<script lang="ts">
	import { page } from '$app/stores'

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
</script>

<!-- Display friends list -->
<div class="m-5">
	<FriendCard name="Franklin" />
</div>
<!-- {#if data.friends}
	{#each data.friends as row}
		<div>{row.friend_1.email}</div>
	{/each}
{:else}
	<div></div>
{/if} -->
