<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer'
	import { Button } from '$lib/components/ui/button'
	import { Camera, CameraResultType } from '@capacitor/camera'
    import { goto } from '$app/navigation'
	import { chosenPhoto } from '$lib/stores.svelte'

	let imageElement: HTMLImageElement
	let srcSet: boolean = $state(false)

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
		const imageUrl = image.webPath

		// Can be set to the src of an image now
		imageElement.src = imageUrl || ''

        chosenPhoto.set(imageUrl || '')

        goto('/add/photo')
	}
</script>

<Drawer.Root>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>New Transaction</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Button on:click={takePicture}>Take a picture</Button>
		<Drawer.Footer>
			<Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
