import { registerUser, loginUser, getCurrentUser } from '../services/authService.js'

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// 获取当前用户
export const getMe = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
