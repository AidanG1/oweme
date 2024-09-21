// import { sesh } from '$lib/auth.svelte'
// import { supabase } from '$lib/db'
// import { error as SKerror } from '@sveltejs/kit'

// export async function load({ params }) {
// 	const session = await sesh.forceGetSession()

// 	const email = session?.user.email

// 	if (!email) {
// 		SKerror(401, 'Unauthorized')
// 	}
// 	/**
// 	 * These get the ones that they owe
// 	 */
// 	const { data: owerData, error } = await supabase
// 		.from('item_user')
// 		.select(
// 			`email, amount_basis_points, item (
//                 id, created_at, name, amount_cents, transaction (
//                     name, payer (
//                         id, email, profile (
//                             name
//                         )
//                     )
//                 )
//             )`
// 		)
// 		.eq('email', email)

// 	const { data: payerData, error: payerError } = await supabase
// 		.from('transactions')
// 		.select(
// 			`name, items (
// 					name, amount_cents, item_user (
// 						email, amount_basis_points
// 					)
// 				)`
// 		)
// 		.eq('payer.email', email)

// 	if (error) {
// 		SKerror(500, error.message)
// 	}

// 	if (payerError) {
// 		SKerror(500, payerError.message)
// 	}

// 	return {
// 		props: {
// 			email,
// 			owerData,
// 			payerData
// 		}
// 	}
// }
