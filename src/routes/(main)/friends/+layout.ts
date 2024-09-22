import { logInCheck } from '$lib/auth.svelte'
import { error as SKerror } from '@sveltejs/kit'
import { supabase } from '$lib/db'
import { sesh } from '$lib/auth.svelte'
import { flyAndScale } from '$lib/utils'

export const load = async () => {
    await logInCheck()

    const { data: friend_data, error: friend_error } = await supabase
        .from('friends')
        .select(`friend_1 (id, venmo, name, email),
                friend_2 (id, venmo, name, email), 
                accepted
        `)
        .or(`friend_1.eq.${sesh.session?.user.id}, friend_2.eq.${sesh.session?.user.id}`)
        // .eq('accepted', true)

    if (friend_error) {
        SKerror(500, friend_error.message)
    }

    // const { data: requests_data, error: request_error } = await supabase
    //     .from('friends')
    //     .select(`friend_1 (id, venmo, name, email),
    //             friend_2 (id, venmo, name, email)
    //     `)
    //     .or(`friend_1.eq.${sesh.session?.user.id}, friend_2.eq.${sesh.session?.user.id}`)
    //     .eq('accepted', false)

    //     if (request_error) {
    //         SKerror(500, request_error.message)
    //     }

    return {
        friends: friend_data,
        // requests: requests_data
    }
}