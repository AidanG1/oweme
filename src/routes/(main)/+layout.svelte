<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Menubar from '$lib/components/ui/menubar/index.js'
	import Contact from 'lucide-svelte/icons/contact'
	import House from 'lucide-svelte/icons/house'
	import SquarePlus from 'lucide-svelte/icons/square-plus'
	import Settings from '$lib/components/Settings.svelte'

	import { profile } from '$lib/auth.svelte'

	let { data } = $props()
</script>

<slot></slot>
<nav>
	<Menubar.Root
		class="fixed bottom-0 left-0 right-0 flex h-20 justify-between rounded-none border-l-0 border-r-0 border-t-2"
	>
		<div class="container mx-auto flex h-3/4 w-full max-w-[435px] justify-between">
			<a href="/" class="my-auto"><House /></a>
			<!-- <Menubar.Menu>
			<div>File</div>
			<Menubar.Trigger>File</Menubar.Trigger> -->
			<!-- </Menubar.Menu> -->
			<Separator orientation="vertical" />
			<!-- </Menubar.Separator> -->
			<!-- <Menubar.SeparatorVertical></Menubar.SeparatorVertical> -->
			<Menubar.Menu>
				<Menubar.Trigger class="font-sans"><SquarePlus /></Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item><a href="/add/manual">Input Manually</a></Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item><a href="/add/photo">Upload from Photo</a></Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Separator orientation="vertical" />
			<a href="/social" class="my-auto"><Contact /></a>
			<Separator orientation="vertical" />
			<!-- open the sheet -->
			<span class="my-auto"><Settings {profile} /></span>
		</div>
	</Menubar.Root>
</nav>
