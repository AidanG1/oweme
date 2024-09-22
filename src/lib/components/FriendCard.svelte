<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	interface FriendCardProps {
		name: string
	}
	let { name }: FriendCardProps = $props()
</script>

<div class="flex flex-row gap-4">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn img" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<p class="my-auto">{name}</p>
</div>
