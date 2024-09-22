<script lang="ts">
	import { chosenPhoto } from '$lib/stores.svelte'
	import { Button } from '$lib/components/ui/button'
	import { sesh } from '$lib/auth.svelte'
	import { supabase } from '$lib/db'

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

	const submitPhoto = async () => {
		// first upload to the bucket and then send the url to the function

		if (!$chosenPhoto) {
			return
		}

		if (!sesh.session) {
			return
		}

		const random = Math.random().toString(36).substring(7)

		const { data, error } = await supabase.storage.from('receipts').upload(random, $chosenPhoto, {
			upsert: false
		})

		if (error) {
			console.error(error)
			return
		}

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
					image_url: data.fullPath
				})
			}
		)

		const json: Schema = await result.json()

		// now want to make 1. transaction 2. receipt 3. items

		const { data: transactionData, error: transactionError } = await supabase
			.from('transactions')
			.insert({
				name: json.name,
				payer: sesh.session.user.id
			})
			.select('id')
			.single()

		if (transactionError) {
			console.error(transactionError)
			return
		}

		const { data: receiptData, error: receiptError } = await supabase.from('receipts').insert({
			transaction: transactionData.id,
			url: json.url,
			tip_cents: json.tip_cents,
			total_cents: json.total_cents,
			tax_cents: json.tax_cents,
			subtotal_cents: json.subtotal_cents
		})

		if (receiptError) {
			console.error(receiptError)
			return
		}

		const json_items = json.items.map((item) => ({
			transaction: transactionData.id,
			name: item.full_name,
			amount_cents: item.total_cents
		}))

		const { data: itemsData, error: itemsError } = await supabase.from('items').insert(json_items)

		if (itemsError) {
			console.error(itemsError)
			return
		}

		console.log('done')
	}

	import { Camera, CameraResultType } from '@capacitor/camera'
	import { onMount } from 'svelte'
	import { ChevronRight } from 'lucide-svelte'

	const takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri
		})

		// image.webPath will contain a path that can be set as an image src.
		// You can access the original file using image.path, which can be
		// passed to the Filesystem API to read the raw data of the image,
		// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
		var imageUrl = image.webPath

		// Can be set to the src of an image now
		$chosenPhoto = imageUrl ?? ''

		// also want to close the camera
		// await Camera.close()
	}

	onMount(() => {
		if (!$chosenPhoto) {
			takePicture()
		}
	})
</script>

<div class="h-[84vh] flex justify-center flex-col">
	<div class="flex-grow">
		{#if $chosenPhoto}
			<!-- we need to set the chosen photo -->
			<Button on:click={takePicture}>Retake picture</Button>
			<img src={$chosenPhoto} alt="chosen" />
		{:else}
			<p class="text-red-500">No photo chosen</p>
			<Button on:click={takePicture}>Take picture</Button>
		{/if}
	</div>
	<div class="flex justify-center">
		<Button
			on:click={submitPhoto}
			class="bg-transparent text-2xl font-bold text-primary hover:text-white"
		>
			Submit picture <ChevronRight />
		</Button>
	</div>
</div>
