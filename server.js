import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import logger from './lib/logger.js'

// 加载环境变量
dotenv.config()

const app = express()

// 配置中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/api/auth', authRoutes)
app.use('/api/feedback', feedbackRoutes)

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' })
})

// 启动服务器
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
