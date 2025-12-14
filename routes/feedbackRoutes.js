import { Router } from 'express'
import { createFeedback, getUserFeedback, getAllFeedback, getAllFeedbackFromBackup } from '../controllers/feedbackController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = Router()

// 反馈路由

// 创建反馈（需要登录）
router.post('/', protect, createFeedback)

// 获取当前用户的反馈（需要登录）
router.get('/user', protect, getUserFeedback)

// 获取所有反馈（管理员使用，需要登录）
router.get('/', protect, getAllFeedback)

// 从文件获取所有反馈（备用方案，需要登录）
router.get('/backup', protect, getAllFeedbackFromBackup)

export default router
