import { profile, sesh } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { redirect } from '@sveltejs/kit'

export const prerender = true
export const ssr = false

supabase.auth.getSession().then(({ data }) => {
	sesh.setSession(data.session)
})

supabase.auth.onAuthStateChange((_event, _session) => {
	sesh.setSession(_session)
})

export const load = async ({ url }) => {
	// get the profile of the user
	const prof = await profile.optionalSetProfile()

	console.log(prof)

	const { pathname } = url

	return { pathname, prof }
}