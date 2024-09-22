<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { Contact, House, Settings, SquarePlus } from 'lucide-svelte'

	let handleClick = () => {
		console.log('clicked')
	}
</script>

<slot></slot>
<nav>
	<Menubar.Root
		class="fixed bottom-0 left-0 right-0 flex h-20 justify-between rounded-none border-l-0 border-r-0 border-t-2"
	>
		<div class="container mx-auto flex h-3/4 w-full max-w-[435px] justify-between">
			<a href="/" class="my-auto"><House /></a>
			<Separator orientation="vertical" />
			<Menubar.Menu>
				<Menubar.Trigger class="font-sans"><SquarePlus /></Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item><a href="/receipt/manual">Input Manually</a></Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item><a href="/receipt/upload">Upload from Photo</a></Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Separator orientation="vertical" />
			<a href="/friends" class="my-auto"><Contact /></a>
			<Separator orientation="vertical" />
			<a href="/settings" class="my-auto"><Settings /></a>
		</div>
	</Menubar.Root>
</nav>
