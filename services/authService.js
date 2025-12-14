import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.js'
import { supabase } from '../config/supabase.js'

// 生成JWT令牌
const generateToken = (id) => jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

// 用户注册
const registerUser = async (username, password) => {
  const { data: existing, error: existErr } = await supabase.from('users').select('id').eq('username', username).maybeSingle()
  if (existErr) throw new Error(existErr.message)
  if (existing) throw new Error('Username already exists')
  const password_hash = await bcrypt.hash(password, 10)
  // 随机分配一个猫头鹰头像 (owl-1 到 owl-6)
  const randomAvatarId = `owl-${Math.floor(Math.random() * 6) + 1}`
  const { data: inserted, error: insertErr } = await supabase.from('users').insert([{ username, password_hash, avatar: randomAvatarId }]).select().single()
  if (insertErr) throw new Error(insertErr.message)
  return { _id: inserted.id, username: inserted.username, avatar: inserted.avatar, token: generateToken(inserted.id) }
}

// 用户登录
const loginUser = async (username, password) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('username', username).single()
  if (error) throw new Error(error.message)
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) throw new Error('Invalid username or password')
  return { _id: user.id, username: user.username, avatar: user.avatar, token: generateToken(user.id) }
}

// 获取当前用户
const getCurrentUser = async (userId) => {
  const { data: user, error } = await supabase.from('users').select('id, username, avatar, created_at').eq('id', userId).single()
  if (error) throw new Error('User not found')
  return { _id: user.id, username: user.username, avatar: user.avatar, createdAt: user.created_at }
}

const findUserById = async (userId) => {
  const { data: user, error } = await supabase.from('users').select('id, username, avatar, created_at').eq('id', userId).single()
  if (error) return null
  return { id: user.id, username: user.username, avatar: user.avatar, createdAt: user.created_at }
}

export { registerUser, loginUser, getCurrentUser, findUserById }
