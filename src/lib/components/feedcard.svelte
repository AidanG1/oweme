<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import { Separator } from '$lib/components/ui/separator'

	interface MyProps {
		name: string
		description: string
		time: Date
		price: number
		incoming: boolean
		resolved: boolean
	}
	// let { name, description, price }: MyProps = $props()
</script>

<div class="flex flex-row opacity-50">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn img" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<div class="mx-2">
		<p class="text-s">Franklin</p>
		<p class="text-xs opacity-60">Pizza</p>
	</div>
	<p class="ml-auto">+ 50.0</p>
</div>
<Separator class="my-4" />
