<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import { Separator } from '$lib/components/ui/separator'

	interface FeedCardProps {
		name: string
		description: string
		time: Date
		price: number
		incoming: boolean
		resolved: boolean
	}
	let { name, description, time, price, incoming, resolved }: FeedCardProps = $props()
	let divClass: string = $state('')
	if (resolved) {
		divClass = 'flex flex-row opacity-50'
	} else {
		divClass = 'flex flex-row'
	}
	let date = time.toLocaleString('en-US', {
		day: 'numeric',
		month: 'short'
	})
	price = Number(price).toFixed(2)
</script>

<div class={divClass}>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn img" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<div class="mx-2 flex-grow">
		<div class="flex flex-row items-center gap-2">
			<p class="text-s">{name}</p>
			<p class="text-xs opacity-60">{date}</p>
		</div>
		<p class="text-xs opacity-60">{description}</p>
	</div>
	{#if incoming}
		<p class="ml-auto text-green-500">+ {price}</p>
	{:else}
		<p class="ml-auto text-red-500">- {price}</p>
	{/if}
</div>
<Separator class="my-4" />
