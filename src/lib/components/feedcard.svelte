<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import { Separator } from '$lib/components/ui/separator'

	interface MyProps {
		name: string
		description: string
		price: number
	}
	let { name, description, price }: MyProps = $props()
</script>

<div class="flex flex-row">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn img" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<div class="mx-2">
		<p class="text-s">{name}</p>
		<p class="text-xs opacity-60">{description}</p>
	</div>
	<p class="ml-auto">+ {price}</p>
</div>
<Separator class="my-4" />
