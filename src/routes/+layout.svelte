<script lang="ts">
	import '@fontsource-variable/inter'
	import '../app.css'
	import { App, type URLOpenListenerEvent } from '@capacitor/app'
	import { goto } from '$app/navigation'
	import Toaster from '$lib/components/Toaster.svelte'
	import { ModeWatcher } from 'mode-watcher'
	App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
		const slug = event.url.split('.app').pop()
		if (slug) {
			goto(slug)
		}
	})
</script>

<Toaster />
<ModeWatcher />

<slot></slot>
