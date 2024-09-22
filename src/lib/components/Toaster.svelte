<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { toasts } from '$lib/toasts.svelte'
	import X from 'lucide-svelte/icons/x'
	import { draw, slide } from 'svelte/transition'

	const getColor = (type: string) => {
		switch (type) {
			case 'success':
				return 'border-green-400'
			case 'error':
				return 'border-red-500'
			default:
				return 'border-blue-500'
		}
	}

	const getBackgroundColor = (type: string) => {
		switch (type) {
			case 'success':
				return 'bg-green-950'
			case 'error':
				return 'bg-red-950'
			default:
				return 'bg-blue-950'
		}
	}
</script>

<div class="fixed bottom-0 right-0 p-4 z-50">
	{#each toasts.toasts as toast}
		<div
			transition:slide
			class="border-2 {getColor(toast.type)} rounded-lg p-2 mb-2 shadow-lg {getBackgroundColor(
				toast.type
			)}"
		>
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<div>
						<p class="text-white">{toast.message}</p>
					</div>
				</div>
				<Button
					variant="ghost"
					on:click={() => toasts.removeToast(toast.id)}
					class="ml-2 border-2 draw"
				>
					<X />
				</Button>
			</div>
		</div>
	{/each}
</div>
