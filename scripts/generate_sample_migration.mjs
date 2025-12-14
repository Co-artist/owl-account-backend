import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

const dir = path.join(process.cwd(), 'migration_data')
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const writeJson = (file, data) => {
  fs.writeFileSync(path.join(dir, file), JSON.stringify(data, null, 2), 'utf-8')
}

const run = async () => {
  const users = [
    { _id: 'u1', username: 'alice', password: await bcrypt.hash('AlicePass123!', 10) },
    { _id: 'u2', username: 'bob', password: await bcrypt.hash('BobPass123!', 10) }
  ]

  const transactions = [
    { user: 'u1', type: 'income', amount: 5000, category: '工资', date: new Date().toISOString().slice(0,10), note: '12月工资' },
    { user: 'u1', type: 'expense', amount: 128, category: '餐饮', date: new Date().toISOString().slice(0,10), note: '午餐' },
    { user: 'u2', type: 'expense', amount: 199, category: '购物', date: new Date(Date.now()-86400000).toISOString().slice(0,10), note: '生活用品' }
  ]

  const categories = [
    { user: 'u1', name: '工资', icon: '💰', type: 'income', color: '#4caf50', usageCount: 12, amountRatio: 65 },
    { user: 'u1', name: '餐饮', icon: '🍴', type: 'expense', color: '#f44336', usageCount: 45, amountRatio: 30 },
    { user: 'u2', name: '购物', icon: '🛒', type: 'expense', color: '#ff9800', usageCount: 18, amountRatio: 25 }
  ]

  const budgets = [
    { user: 'u1', category: '餐饮', icon: '🍴', amount: 2000, used: 1200, usagePercentage: 60, period: 'monthly', type: 'expense' },
    { user: 'u2', category: '购物', icon: '🛒', amount: 1000, used: 800, usagePercentage: 80, period: 'monthly', type: 'expense' }
  ]

  const feedback = [
    { user: 'u1', type: 'bug', content: '统计页加载缓慢', contact: 'alice@example.com', createdAt: new Date().toISOString() },
    { user: 'u2', type: 'suggestion', content: '希望支持导出为 CSV', contact: 'bob@example.com', createdAt: new Date().toISOString() }
  ]

  writeJson('users.json', users)
  writeJson('transactions.json', transactions)
  writeJson('categories.json', categories)
  writeJson('budgets.json', budgets)
  writeJson('feedback.json', feedback)

  console.log('Sample migration data generated')
}

run().catch(e => { console.error(e.message); process.exit(1) })
