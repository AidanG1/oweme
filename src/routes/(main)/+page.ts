import { sesh, userIdOrRedirect } from '$lib/auth.svelte'
import { supabase } from '$lib/db'
import { error as SKerror } from '@sveltejs/kit'

export async function load({ params }) {
	const session = await sesh.forceGetSession()

	await userIdOrRedirect()

	const id = session?.user.id
	const email = session?.user.email
	// const name = session?.user.name

	if (!email || !id) {
		SKerror(401, 'Unauthorized')
	}
	/**
	 * These get the ones that they owe
	 */
	const { data: owerData, error } = await supabase
		.from('item_user')
		// .select(
		// 	`email, amount_basis_points, item (
        //         id, created_at, name, amount_cents, transaction (
        //             name, created_at, payer (
        //                 id, email, name
        //             )
        //         )
        //     )`
		// )
		.select(
			`email, amount_basis_points, item!inner (
				name, amount_cents, transaction!inner (
					name, payer(id, email, name), created_at
				)
			) `
		)
		.eq('email', email)
		.neq('item.transaction.payer', id) // Not the ones that user self is payer

	/** These get the ones where people owe them money */
	const { data: payerData, error: payerError } = await supabase
		.from('item_user')
		.select(
			`email, amount_basis_points, item!inner (
				name, amount_cents, transaction!inner (
					name, payer, created_at
				)
			) `
		)
		.eq('item.transaction.payer', id)
		.neq('email', email) // Not the ones that user self is ower

	if (error) {
		SKerror(500, "ower: " + error.message)
	}

	if (payerError) {
		SKerror(500, "payer: " + payerError.message)
	}

	return {
		props: {
			email,
			owerData,
			payerData
		}
	}
}
