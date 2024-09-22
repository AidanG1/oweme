import type { AuthSession } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import { supabase } from './db'
import type { Tables } from './supabase.types'

function userSession() {
	let session: AuthSession | null = $state(null)

	async function makeSession() {
		const { data, error } = await supabase.auth.getSession()

		if (error) {
			console.error('Error getting session:', error.message)
			return
		}

		setSession(data.session)
	}

	function setSession(newSession: AuthSession | null) {
		session = newSession
	}

	async function forceGetSession() {
		if (session) return session
		await makeSession()
		return session
	}

	return {
		get session() {
			return session
		},
		setSession,
		makeSession,
		forceGetSession,
	}
}

export const sesh = userSession()

export type ProfileUpdate = {
	venmo?: string
	name?: string
}

function userProfile() {
	let profile: Tables<'profiles'> | null = $state(null)

	async function setProfileDB() {
		if (!(await sesh.forceGetSession())) return
		if (!sesh.session) return
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', sesh.session.user.id)
			.single()
		if (error) {
			console.error(error)
		}
		profile = data
		return data
	}

	async function updateProfile(profileUpdate: ProfileUpdate) {
		if (!sesh.session) return

		const { data, error } = await supabase
			.from('profiles')
			.update(profileUpdate)
			.eq('id', sesh.session.user.id)
			.select('*')
			.single()

		if (error) {
			console.error(error)

			return null
		}

		profile = data

		return data
	}

	async function optionalSetProfile() {
		console.log('optionalSetProfile')
		console.log(profile)
		if (!profile) {
			await setProfileDB()
		}
		console.log(profile)

		return profile
	}

	return {
		get profile() {
			return profile
		},
		setProfileDB,
		updateProfile,
		optionalSetProfile
	}
}

export const profile = userProfile()

export async function logInCheck() {
	console.log('Checking login status')
	if (!sesh.session) {
		await sesh.makeSession()
	}

	if (!sesh.session) {
		return redirect(307, '/account/login')
	}
}

export async function userIdOrRedirect() {
	await logInCheck()
	if (!sesh.session) {
		return redirect(307, '/account/login')
	}

	return sesh.session.user.id
}
