import fs from 'fs'
import path from 'path'

const backendDir = process.cwd()
const projectRoot = path.resolve(backendDir, '..')
const migrationDir = path.join(backendDir, 'migration_data')

const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'))
const writeJson = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')

const fileExists = (p) => { try { fs.accessSync(p); return true } catch { return false } }

const sources = ['users.json','transactions.json','categories.json','budgets.json','feedback.json']

const classify = (o) => {
  const k = Object.keys(o)
  if (k.includes('username') && k.includes('password')) return 'users'
  if (k.includes('type') && k.includes('amount') && k.includes('category') && (k.includes('date') || k.includes('note'))) return 'transactions'
  if (k.includes('usageCount') || k.includes('amountRatio')) return 'categories'
  if (k.includes('usagePercentage') && k.includes('period')) return 'budgets'
  if (k.includes('content') && k.includes('type')) return 'feedback'
  return null
}

const main = async () => {
  ensureDir(migrationDir)

  let copied = 0
  for (const f of sources) {
    const src = path.join(projectRoot, f)
    if (fileExists(src)) {
      const dst = path.join(migrationDir, f)
      fs.copyFileSync(src, dst)
      copied++
    }
  }

  if (copied === 0) {
    const possible = [path.join(projectRoot, 'test_data.json'), path.join(backendDir, 'test_data.json')]
    const found = possible.find(fileExists)
    if (!found) {
      console.log('No source JSON files found')
      process.exit(1)
    }
    const arr = readJson(found)
    if (!Array.isArray(arr)) {
      console.log('test_data.json must be a JSON array')
      process.exit(1)
    }
    const buckets = { users: [], transactions: [], categories: [], budgets: [], feedback: [] }
    for (const o of arr) {
      const t = classify(o)
      if (t) buckets[t].push(o)
    }
    for (const key of Object.keys(buckets)) {
      if (buckets[key].length > 0) {
        writeJson(path.join(migrationDir, `${key}.json`), buckets[key])
      }
    }
  }

  const summary = {}
  for (const f of sources) {
    const p = path.join(migrationDir, f)
    if (fileExists(p)) {
      const data = readJson(p)
      summary[f] = Array.isArray(data) ? data.length : 0
    } else {
      summary[f] = 0
    }
  }
  console.log(JSON.stringify(summary))
}

main().catch(e => { console.error(e.message); process.exit(1) })
