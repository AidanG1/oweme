import { sesh } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { error as SKerror } from '@sveltejs/kit'

export async function load({ }) {
	const session = await sesh.forceGetSession()

	if (!session) {
		SKerror(401, 'Unauthorized')
	}

	const id = session.user.id

	if (!id) {
		SKerror(401, 'Unauthorized')
	}
	/**
	 * These get the ones that they owe
	 */
	const { data: friendsData, error } = await supabase
		.from('friends')
		.select(`friend_1 (id, name, email), friend_2 (id, name, email)
        `)
		.or(`friend_1.eq.${id},friend_2.eq.${id}`)
		.eq('accepted', true)

	console.log('data', friendsData)

	if (error) {
		SKerror(500, error.message)
	}

	return {
		props: {
			friendsData,
			id
		}
	}
}
