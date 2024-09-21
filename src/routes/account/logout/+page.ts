import { sesh } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { redirect } from '@sveltejs/kit'

export const load = async () => {
	if (!sesh.session?.user.is_anonymous) {
		// logout
		await supabase.auth.signOut()
	}
}