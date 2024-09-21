// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'
import { corsHeaders } from '../_shared/cors.ts'
import { getAIResponse } from './run.ts'

console.log('Hello from AI Function!')

Deno.serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

  const authHeader = req.headers.get('Authorization')

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: userData } = await supabaseClient.auth.getUser(token)
  const user = userData.user


	const {
		image_url,
    usePro
	}: {
		image_url: string,
    usePro?: boolean
	} = await req.json()

    let model = ''
    if (usePro) {
        model = 'gemini-1.5-pro'
    } else {
        model = 'gemini-1.5-flash'
    }

	const supabaseAdminClient = createClient(
		// Supabase API URL - env var exported by default when deployed.
		Deno.env.get('SUPABASE_URL') ?? '',
		// Supabase API SERVICE ROLE KEY - env var exported by default when deployed.
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
	)

    const geminiKey = Deno.env.get('GEMINI_KEY') ?? ''

    const res = await getAIResponse(image_url, geminiKey, model)

    // first create a transaction, then create a receipt, then create items
    const { data: transactionData, error: transactionError } = await supabaseAdminClient
      .from('transactions')
      .insert(
        {
          name: res.name,
          payer: user.id,
        }
      )

    if (transactionError) {
        console.error(transactionError)
        return new Response(JSON.stringify(transactionError), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }

    const transaction_id = transactionData.id

    const { data: receiptData, error: receiptError } = await supabaseAdminClient
      .from('receipts')
      .insert(
        {
          name: res.name,
          url: image_url,
          transaction: transaction_id,
          tip_cents: res.tip_cents,
          total_cents: res.total_cents,
          tax_cents: res.tax_cents,
          subtotal_cents: res.subtotal_cents,
        }
      )

    if (receiptError) {
        console.error(receiptError)
        return new Response(JSON.stringify(receiptError), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })

    }

    const receipt_id = receiptData.id

    if (error) {
        console.error(error)
        return new Response(JSON.stringify(error), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }

    return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
    })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/logos' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/