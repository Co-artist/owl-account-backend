import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const run = async () => {
  const { error } = await supabase.from('users').select('id').limit(1)
  if (error) throw new Error(error.message)
  console.log('Supabase connectivity ok')
}

run().catch(e => { console.error(e.message); process.exit(1) })
