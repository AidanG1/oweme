<script lang="ts">
	import { goto } from '$app/navigation'
	import { sesh } from '$lib/auth.svelte'
	import * as Alert from '$lib/components/ui/alert'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { supabase } from '$lib/db'
	import { PinInput } from 'bits-ui'
	import CircleAlert from 'lucide-svelte/icons/circle-alert'
	import LoaderCircle from 'lucide-svelte/icons/loader-circle'
	import Mail from 'lucide-svelte/icons/mail'

	let show_alert = $state(false)
	let email = $state('')
	let alertHeader = $state('')
	let alertMessage = $state('')
	let loading = $state(false)
	let pinShowing = $state(false)

	const handleLogin = async () => {
		if (sesh.session?.user.is_anonymous) {
			loading = true
			const { error } = await supabase.auth.updateUser({
				email
			})

			if (error) throw error
			alertHeader = 'Check your email'
			alertMessage = 'OweMe sent you a link to sign in'
			show_alert = true
			pinShowing = true
			loading = false
		} else {
			try {
				loading = true
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: { emailRedirectTo: window.location.origin + '/' }
				})
				if (error) throw error
				alertHeader = 'Check your email'
				alertMessage = 'OweMe sent you a link to sign in'
				show_alert = true
				pinShowing = true
			} catch (error) {
				if (error instanceof Error) {
					alertHeader = 'Error'
					alertMessage = error.message
					show_alert = true
				} else {
					alertHeader = 'Error'
					alertMessage = 'An error occurred'
					show_alert = true
				}
			} finally {
				loading = false
			}
		}
	}

	const otpLength = 6
	let otp: string[] = $state([])
</script>

<div class="h-1/4"></div>
<h1 class="m-16 text-center text-4xl">Log In</h1>

{#if show_alert}
	<Alert.Root variant={alertHeader === 'Error' ? 'destructive' : 'default'} class="m-6 w-96">
		<CircleAlert class="h-4 w-4" />
		<Alert.Title>{alertHeader}</Alert.Title>
		<Alert.Description>{alertMessage}</Alert.Description>
	</Alert.Root>
{/if}

{#if pinShowing}
	<form
		class="m-6 flex w-96 items-center justify-center gap-2 rounded-md border-2 border-primary p-2"
	>
		<div>
			<Label for="otp">Enter the OTP sent to your email</Label>
			<PinInput.Root
				bind:value={otp}
				class="mb-2 flex items-center gap-2"
				type="text"
				placeholder="0"
				id="otp"
			>
				{#each Array.from({ length: otpLength }) as _, i}
					<PinInput.Input
						class="h-input font-alt placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-10 select-none rounded-md border border-foreground bg-background px-2 py-3 text-center text-[17px] tracking-[0.01em] text-foreground"
					/>
				{/each}
				<PinInput.HiddenInput />
			</PinInput.Root>
		</div>
		<!-- <Input
			type="text"
			placeholder="Enter OTP"
			class="w-full my-2"
			bind:value={otp}
			id="otp"
			minlength={6}
			maxlength={6}
		/> -->
		<Button
			class="mb-2 mt-auto h-[51.5px]"
			type="submit"
			on:click={async () => {
				const { error } = await supabase.auth.verifyOtp({
					email,
					token: otp.join(''),
					type: 'email'
				})

				if (error) {
					alertHeader = 'Error'
					alertMessage = error.message
					show_alert = true
				} else {
					goto('/')
				}
			}}
		>
			Verify
		</Button>
	</form>
{/if}
{#if !pinShowing}
	<div class="m-6 flex w-96 justify-center">
		<form onsubmit={handleLogin} class="w-full">
			<Label for="email">Email Address</Label>
			<Input
				type="email"
				placeholder="Enter email address"
				class="my-2 w-full"
				bind:value={email}
				id="email"
			/>
			<Button variant="outline" type="submit" disabled={loading || !email} class="w-full">
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4" />
				{:else}
					<Mail class="mr-2 h-4 w-4" /> Sign up or log in
				{/if}
			</Button>
		</form>
	</div>
{/if}
