import { supabase } from '../config/supabase.js'
import { saveFeedbackToFile, getAllFeedbackFromFile, getFeedbackByUserIdFromFile } from '../utils/feedbackStorage.js'

// 创建反馈
const createFeedback = async (req, res) => {
  try {
    const { type, content, contact } = req.body;
    const userId = req.user.id;
    
    // 验证必填字段
    if (!type || !content) {
      return res.status(400).json({ message: '反馈类型和内容不能为空' });
    }
    
    // 创建反馈对象
    const { data: feedback, error } = await supabase.from('feedback').insert([{ user_id: userId, type, content, contact }]).select().single()
    if (error) {
      res.status(500).json({ message: '创建反馈失败', error: error.message })
      return
    }
    
    // 同时保存到文件（双重备份）
    saveFeedbackToFile({ userId, type, content, contact, createdAt: feedback.created_at })
    
    res.status(201).json({ message: '反馈提交成功', feedback })
  } catch (error) {
    res.status(500).json({ message: '创建反馈失败', error: error.message })
  }
};

// 获取所有反馈（管理员使用）
const getAllFeedback = async (req, res) => {
  try {
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })
    if (error) {
      res.status(500).json({ message: '获取反馈列表失败', error: error.message })
      return
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: '获取反馈列表失败', error: error.message })
  }
};

// 获取当前用户的反馈
const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase.from('feedback').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) {
      res.status(500).json({ message: '获取用户反馈失败', error: error.message })
      return
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: '获取用户反馈失败', error: error.message })
  }
};

// 从文件获取所有反馈（备用方案）
const getAllFeedbackFromBackup = async (req, res) => {
  try {
    const feedback = getAllFeedbackFromFile();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: '从备份获取反馈失败', error: error.message });
  }
};

export { createFeedback, getAllFeedback, getUserFeedback, getAllFeedbackFromBackup }
