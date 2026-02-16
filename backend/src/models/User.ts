import { db } from '../database/init.js'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  username: string
  password_hash: string
  role: string
  barber_id: number | null
  created_at: string
}

export const UserModel = {
  findById: (id: number): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
  },

  findByUsername: (username: string): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined
  },

  verifyPassword: (user: User, password: string): boolean => {
    return bcrypt.compareSync(password, user.password_hash)
  },

  create: (username: string, passwordHash: string, role: string, barberId: number | null = null): void => {
    db.prepare('INSERT INTO users (username, password_hash, role, barber_id) VALUES (?, ?, ?, ?)').run(username, passwordHash, role, barberId)
  }
}
