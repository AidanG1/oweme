import { sesh } from '$lib/auth.svelte'
import { supabase } from '$lib/db'

export async function load({ params }) {
	const session = await sesh.forceGetSession()

	const email = session?.user.email

	if (!email) {
		return 'sad'
	}

	const { data, error } = await supabase
		.from('item_user')
		.select(
			`email, amount_basis_points, item (
                id, created_at, name, amount_cents, transaction (
                    name, payer (
                        id, email, profile (
                            name
                        )
                    )
                )
            )`
		)
		.eq('email', email)

	if (error) {
	}
}
