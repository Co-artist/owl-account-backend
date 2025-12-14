import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.js'
import { findUserById } from '../services/authService.js'

const protect = async (req, res, next) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, no token' })
    return
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    const user = await findUserById(decoded.id)
    if (!user) {
      res.status(401).json({ message: 'Not authorized, token failed' })
      return
    }
    req.user = { id: user.id, username: user.username }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

export { protect }
