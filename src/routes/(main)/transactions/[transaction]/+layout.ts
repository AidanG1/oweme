import { logInCheck } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { error as SKerror } from '@sveltejs/kit'

export const prerender = false

export const load = async ({ params }) => {
    await logInCheck()

    const transaction_id = params.transaction

    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('transaction', transaction_id)

    if (error) {
        console.error(error)
        return SKerror(500, 'Failed to load items')
    }

    return {
        items: data,
        transaction_id: params.transaction
    }
}