import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'))
const readMaybe = (p) => {
  try { return readJson(p) } catch { return [] }
}

const run = async () => {
  const base = path.resolve(process.cwd(), 'migration_data')
  const users = readMaybe(path.join(base, 'users.json'))
  const transactions = readMaybe(path.join(base, 'transactions.json'))
  const categories = readMaybe(path.join(base, 'categories.json'))
  const budgets = readMaybe(path.join(base, 'budgets.json'))
  const feedback = readMaybe(path.join(base, 'feedback.json'))

  const userIdMap = new Map()

  for (const u of users) {
    const pw = String(u.password || '')
    const isHashed = pw.startsWith('$2a$') || pw.startsWith('$2b$') || pw.startsWith('$2y$')
    const password_hash = isHashed ? pw : await bcrypt.hash(pw || 'Passw0rd!', 10)
    const { data, error } = await supabase.from('users').insert([{ username: u.username, password_hash, legacy_mongo_id: u._id }]).select().single()
    if (error) throw new Error(error.message)
    userIdMap.set(u._id, data.id)
  }

  const mapUser = (id) => userIdMap.get(id)

  let fallbackUserId = null
  if (users.length === 0) {
    const { data: created, error: createErr } = await supabase.from('users').insert([{ username: `migrated_user_${Date.now()}`, password_hash: await bcrypt.hash('Passw0rd!', 10) }]).select().single()
    if (createErr) throw new Error(createErr.message)
    fallbackUserId = created.id
  }

  if (transactions.length) {
    const rows = transactions.map(t => ({ user_id: mapUser(t.user) || fallbackUserId, type: t.type, amount: Number(t.amount), category: t.category, date: new Date(t.date).toISOString().slice(0,10), note: t.note }))
    const { error } = await supabase.from('transactions').insert(rows)
    if (error) throw new Error(error.message)
  }

  if (categories.length) {
    const rows = categories.map(c => ({ user_id: mapUser(c.user) || fallbackUserId, name: c.name, icon: c.icon, type: c.type, color: c.color, usage_count: Number(c.usageCount || 0), amount_ratio: Number(c.amountRatio || 0) }))
    const { error } = await supabase.from('categories').insert(rows)
    if (error) throw new Error(error.message)
  }

  if (budgets.length) {
    const rows = budgets.map(b => ({ user_id: mapUser(b.user) || fallbackUserId, category: b.category, icon: b.icon, amount: Number(b.amount), used: Number(b.used || 0), usage_percentage: Number(b.usagePercentage || 0), period: b.period, type: b.type }))
    const { error } = await supabase.from('budgets').insert(rows)
    if (error) throw new Error(error.message)
  }

  if (feedback.length) {
    const rows = feedback.map(f => ({ user_id: mapUser(f.user) || fallbackUserId, type: f.type, content: f.content, contact: f.contact, created_at: f.createdAt }))
    const { error } = await supabase.from('feedback').insert(rows)
    if (error) throw new Error(error.message)
  }
}

run().then(() => { console.log('Migration completed') }).catch(e => { console.error(e.message); process.exit(1) })
