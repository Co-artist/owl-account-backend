import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY, { auth: { persistSession: false } })

const count = async (table) => {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true })
  if (error) throw new Error(error.message)
  return count || 0
}

const run = async () => {
  const tables = ['users','transactions','categories','budgets','feedback']
  const result = {}
  for (const t of tables) {
    result[t] = await count(t)
  }
  console.log(JSON.stringify(result))
}

run().catch(e => { console.error(e.message); process.exit(1) })
