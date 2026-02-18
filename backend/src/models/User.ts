import { db } from '../database/init.js'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  username: string
  password_hash: string
  role: string
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

  create: (username: string, password: string, role: string = 'client'): User => {
    const passwordHash = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, role)
    return UserModel.findById(result.lastInsertRowid as number)!
  },

  exists: (username: string): boolean => {
    const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    return !!user
  }
}
