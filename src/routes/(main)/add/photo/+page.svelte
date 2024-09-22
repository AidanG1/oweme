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
	let submitted = $state(false)

	const submitPhoto = async () => {
		submitted = true
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
	import CameraIcon from 'lucide-svelte/icons/camera'

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
	<div class="flex h-full w-full flex-grow justify-center align-middle">
		{#if chosenPhoto}
			<!-- we need to set the chosen photo -->
			<img src="data:image/jpg;base64, {chosenPhoto}" alt="chosen" class="	" />
		{:else}
			<div class="flex h-full flex-col justify-center">
				<p class="justify-center text-2xl font-semibold text-red-500">No photo chosen</p>
				<Button on:click={takePicture} class="max-w-96 text-2xl font-semibold"
					>Take picture <CameraIcon class="ml-2" /></Button
				>
			</div>
		{/if}
	</div>
	{#if chosenPhoto}
		<div class="flex justify-center">
			<Button
				on:click={takePicture}
				class="grow justify-start text-2xl font-bold text-primary hover:text-white"
				variant="ghost"
				disabled={submitted}>Retake</Button
			>
			<Button
				on:click={submitPhoto}
				class="bg-transparent text-2xl font-bold text-primary hover:text-white"
				disabled={submitted}
			>
				{#if submitted}
					Submitting <div class="lds-dual-ring"></div>
				{:else}
					Use Photo
				{/if}
			</Button>
		</div>
	{/if}
</div>

<style>
	.lds-dual-ring {
		/* change color here */
		color: #1c4c5b;
	}
	.lds-dual-ring,
	.lds-dual-ring:after {
		box-sizing: border-box;
	}
	.lds-dual-ring {
		display: inline-block;
		width: 80px;
		height: 80px;
	}
	.lds-dual-ring:after {
		content: ' ';
		display: block;
		width: 64px;
		height: 64px;
		margin: 8px;
		border-radius: 50%;
		border: 6.4px solid currentColor;
		border-color: currentColor transparent currentColor transparent;
		animation: lds-dual-ring 1.2s linear infinite;
	}
	@keyframes lds-dual-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
