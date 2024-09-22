<script lang="ts">
	// import { chosenPhoto } from '$lib/stores.svelte'
	import { Button } from '$lib/components/ui/button'
	import { sesh } from '$lib/auth.svelte'
	import { supabase } from '$lib/db'
	import { decode } from 'base64-arraybuffer'

	const url = 'https://veaseskfycpcrozeqgib.supabase.co/functions/v1/scan-receipt'

	interface Item {
		ocr_name: string
		full_name: string
		total_cents: number
	}

	interface Schema {
		name: string
		ordered_timestamp: string
		url: string
		tip_cents: number
		total_cents: number
		tax_cents: number
		subtotal_cents: number
		items: Item[]
	}

	let chosenPhoto: string = $state('')

	const submitPhoto = async () => {
		// first upload to the bucket and then send the url to the function
		console.log('submitting photo')

		console.log('chosen photo has length', chosenPhoto.length)

		if (!chosenPhoto) {
			console.log('no photo chosen')
			return
		}

		if (!sesh.session) {
			console.log('no session')
			return
		}

		const random = Math.random().toString(36).substring(7)

		const { data, error } = await supabase.storage
			.from('receipts')
			.upload(random, decode(chosenPhoto), {
				upsert: false,
				contentType: 'image/jpeg'
			})

		if (error) {
			console.error(error)
			return
		}

		console.log(data)

		const basePath = 'https://veaseskfycpcrozeqgib.supabase.co/storage/v1/object/public/receipts/'

		const result = await fetch(
			'https://veaseskfycpcrozeqgib.supabase.co/functions/v1/scan-receipt',
			{
				// const result = await fetch('http://localhost:54321/functions/v1/logos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sesh.session.access_token}`
				},
				body: JSON.stringify({
					type: 'link',
					image_url: basePath + data.path
				})
			}
		)

		const json: {
			res: Schema
			transactionData: Tables<'transactions'>
		} = await result.json()

		console.log(json)

		const transaction_id = json.transactionData.id

		goto(`/transactions/${transaction_id}/friends`)
	}

	import { Camera, CameraResultType } from '@capacitor/camera'
	import { onMount } from 'svelte'
	import type { Tables } from '$lib/supabase.types'
	import { goto } from '$app/navigation'

	const takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Base64
		})

		// image.webPath will contain a path that can be set as an image src.
		// You can access the original file using image.path, which can be
		// passed to the Filesystem API to read the raw data of the image,
		// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
		var imageUrl = image.base64String

		// Can be set to the src of an image now
		chosenPhoto = imageUrl ?? ''

		console.log('set chosen photo to length', chosenPhoto.length)

		// also want to close the camera
		// await Camera.close()
	}

	onMount(() => {
		if (!chosenPhoto) {
			takePicture()
		}
	})
</script>

<div class="flex h-[84vh] flex-col justify-center">
	<div class="flex flex-grow flex-col justify-center">
		{#if chosenPhoto}
			<!-- we need to set the chosen photo -->
			<img src="data:image/jpg;base64, {chosenPhoto}" alt="chosen" class="	" />
		{:else}
			<p class="text-red-500">No photo chosen</p>
			<Button on:click={takePicture}>Take picture</Button>
		{/if}
	</div>
	{#if chosenPhoto}
		<div class="flex justify-center">
			<Button
				on:click={takePicture}
				class="grow justify-start text-2xl font-bold text-primary hover:text-white"
				variant="ghost">Retake</Button
			>
			<Button
				on:click={submitPhoto}
				class="bg-transparent text-2xl font-bold text-primary hover:text-white"
			>
				Use Photo
			</Button>
		</div>
	{/if}
</div>
