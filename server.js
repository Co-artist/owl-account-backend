import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import updateRoutes from './routes/updateRoutes.js'
import logger from './lib/logger.js'

// 配置 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

// 配置中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务 (用于热更新包下载)
app.use('/updates', express.static(path.join(__dirname, 'public/updates')))

// 路由配置
app.use('/api/auth', authRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/updates', updateRoutes)

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' })
})

// 启动服务器
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
