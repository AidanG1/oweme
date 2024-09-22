import { supabase } from '$lib/db.js'
import { error as SKerror } from '@sveltejs/kit'

export const load = async ({ params }) => {
    const transaction_id = params.transaction
    console.log(transaction_id)

    const { data, error } = await supabase
        .from('item_user')
        .select(`
            email, amount_basis_points, item!inner (
                name, amount_cents, transaction
            )
            `)
        .eq('item.transaction', transaction_id)
    console.log(data)

    if (error) {
        console.error(error)
        return SKerror(500, "Failed to load items")
    }

    const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('name, payer (name, email)')
        .eq('id', transaction_id)

    if (transError) {
        console.error(error)
        return SKerror(500, "Failed to load items")
    }

    return {
        props: {
            data,
            transData
        }
    }
}