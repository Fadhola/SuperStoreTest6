// backend/middleware/auth.js

const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1] // Expecting 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id: userId, username: username }
    next()
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' })
  }
}

module.exports = auth
