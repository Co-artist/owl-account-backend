import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 定义反馈文件路径
const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');

// 确保数据目录存在
const ensureDataDirectory = () => {
  const dataDir = path.dirname(FEEDBACK_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// 确保反馈文件存在
const ensureFeedbackFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([]), 'utf8');
  }
};

// 保存反馈到文件
const saveFeedbackToFile = (feedback) => {
  ensureFeedbackFile();
  
  try {
    // 读取现有反馈
    const existingFeedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    
    // 添加新反馈
    const updatedFeedback = [...existingFeedback, {
      ...feedback,
      createdAt: feedback.createdAt || new Date().toISOString()
    }];
    
    // 写入文件
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(updatedFeedback, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存反馈到文件失败:', error);
    return false;
  }
};

// 获取所有反馈
const getAllFeedbackFromFile = () => {
  ensureFeedbackFile();
  
  try {
    const feedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    return feedback;
  } catch (error) {
    console.error('读取反馈文件失败:', error);
    return [];
  }
};

// 获取特定用户的反馈
const getFeedbackByUserIdFromFile = (userId) => {
  ensureFeedbackFile();
  
  try {
    const allFeedback = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    return allFeedback.filter(feedback => feedback.userId === userId);
  } catch (error) {
    console.error('获取用户反馈失败:', error);
    return [];
  }
};

export { saveFeedbackToFile, getAllFeedbackFromFile, getFeedbackByUserIdFromFile }
