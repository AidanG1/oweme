import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON } from '$env/static/public'
import { type Database } from './supabase.types'

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON)

export const storageUrl = (bucket: string, file: string) => `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${file}`