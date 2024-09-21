import { logInCheck } from '$lib/auth.svelte'
import { error as SKerror } from '@sveltejs/kit'
import { supabase } from '$lib/db'
import { sesh } from '$lib/auth.svelte'

export const load = async () => {
    await logInCheck()

    const { data, error } = await supabase
        .from('friends')
        .select(`friend_1 (id, venmo, name, email),
                friend_2 (id, venmo, name, email)
        `)
        .or(`friend_1.eq.${sesh.session?.user.id},friend_2.eq.${sesh.session?.user.id}`)
        .eq('accepted', true)

    if (error) {
        SKerror(500, error.message)
    }

    return {
        friends: data
    }
}