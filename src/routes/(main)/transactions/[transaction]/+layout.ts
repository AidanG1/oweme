import { logInCheck } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { error as SKerror } from '@sveltejs/kit'

export const prerender = false

export const load = async ({ params }) => {
    await logInCheck()

    const transaction_id = params.transaction

    const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transaction_id)
        .single()

    if (transactionError) {
        console.error(transactionError)
        return SKerror(500, 'Failed to load transaction')
    }

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
        transaction_id: params.transaction,
        transaction: transactionData
    }
}