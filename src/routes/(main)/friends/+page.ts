import { sesh } from "$lib/auth.svelte"
import { supabase } from "$lib/db"
import { error as SKerror } from '@sveltejs/kit'

export async function load({ params }) {
    const session = await sesh.forceGetSession()
    const id = session?.user.id

    if (!id) {
        SKerror(401, "Unauthorized")
    }

    const { data, error } = await supabase
        .from("friends")
        .select(
            `created_at, accepted, friend_1 (
                name, email, id, avatar_url
            ), friend_2 (
                name, email, id, avatar_url
            )`
        )
        .or(`friend_1.eq.${id},friend_2.eq.${id}`)
    console.log("DATA!:", data)

    if (error) {
        SKerror(500, error.message)
    }

    return {
        props: {
            data,
            id
        }
    }
}