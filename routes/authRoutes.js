import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = Router()

// 注册路由
router.post('/register', register)

// 登录路由
router.post('/login', login)

// 获取当前用户路由
router.get('/me', protect, getMe)

export default router
