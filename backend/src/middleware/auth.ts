import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'gimenes-barber-shop-secret-key-2024'

export interface AuthRequest extends Request {
  userId?: number
  userRole?: string
  barberId?: number
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token nao fornecido' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string; barberId?: number }
    req.userId = decoded.id
    req.userRole = decoded.role
    req.barberId = decoded.barberId
    next()
  } catch {
    return res.status(401).json({ message: 'Token invalido' })
  }
}

export function generateToken(userId: number, role: string, barberId?: number): string {
  return jwt.sign({ id: userId, role, barberId }, JWT_SECRET, { expiresIn: '7d' })
}
