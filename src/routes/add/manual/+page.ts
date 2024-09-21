import { logInCheck } from '$lib/auth.svelte'

export const load = async () => {
	await logInCheck()
}