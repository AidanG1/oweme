<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import { toasts } from '$lib/toasts.svelte'
	import { type ProfileUpdate } from '$lib/auth.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import Settings from 'lucide-svelte/icons/settings'

	let {
		profile
	}: {
		profile: typeof import('$lib/auth.svelte').profile
	} = $props()

	let profileUpdate: ProfileUpdate = $state({})

	// initially the profile update object to existing profile information
	profileUpdate = {
		name: profile.profile?.name || '',
		venmo: profile.profile?.venmo || ''
	}
</script>

<!-- edit profile, add your venmo, edit your full name, change your profile picture, logout -->

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost"><Settings /></Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>
				Make changes to your profile here. Click save when you're done. You are logged in as {profile
					.profile?.email}
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" bind:value={profileUpdate.name} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="venmo" class="text-right">Venmo Username</Label>
				<Input id="venmo" bind:value={profileUpdate.venmo} class="col-span-3" />
			</div>
		</div>
		<Sheet.Close asChild let:builder>
			<Button
				builders={[builder]}
				type="submit"
				class="mb-2 w-full"
				on:click={() => {
					const res = profile.updateProfile(profileUpdate)
					if (!res) {
						toasts.addToast({ message: 'Profile update failed', type: 'error' })
						return
					} else {
						toasts.addToast({ message: 'Profile updated', type: 'success' })
					}
				}}>Save changes</Button
			>
		</Sheet.Close>
		<Sheet.Footer>
			<Dialog.Root>
				<Dialog.Trigger class="w-full rounded-md border-2 border-red-700 p-2">Logout</Dialog.Trigger
				>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Confirm Logout</Dialog.Title>
					</Dialog.Header>
					<Dialog.Footer>
						<Button variant="destructive" href="/account/logout">Logout</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
