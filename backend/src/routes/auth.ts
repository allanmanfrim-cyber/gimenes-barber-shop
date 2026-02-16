import { Router } from 'express'
import { UserModel } from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario e senha sao obrigatorios' })
    }

    const user = UserModel.findByUsername(username)
    if (!user) {
      return res.status(401).json({ message: 'Credenciais invalidas' })
    }

    if (!UserModel.verifyPassword(user, password)) {
      return res.status(401).json({ message: 'Credenciais invalidas' })
    }

    const token = generateToken(user.id, user.role, user.barber_id || undefined)

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        barberId: user.barber_id
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' })
  }
})

export default router
