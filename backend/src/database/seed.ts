import { db, initDatabase } from './init.js'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

initDatabase()

const services = [
  { name: 'Corte Masculino', duration_minutes: 30, price: 45.00 },
  { name: 'Barba', duration_minutes: 20, price: 30.00 },
  { name: 'Corte + Barba', duration_minutes: 45, price: 65.00 },
  { name: 'Sobrancelha', duration_minutes: 10, price: 15.00 },
  { name: 'Pigmentacao', duration_minutes: 40, price: 80.00 }
]

const barbers = [
  { name: 'Carlos Gimenes' },
  { name: 'Rafael Santos' }
]

const businessHours = [
  { day_of_week: 0, open_time: '00:00', close_time: '00:00', is_open: 0 },
  { day_of_week: 1, open_time: '09:00', close_time: '19:00', is_open: 1 },
  { day_of_week: 2, open_time: '09:00', close_time: '19:00', is_open: 1 },
  { day_of_week: 3, open_time: '09:00', close_time: '19:00', is_open: 1 },
  { day_of_week: 4, open_time: '09:00', close_time: '19:00', is_open: 1 },
  { day_of_week: 5, open_time: '09:00', close_time: '19:00', is_open: 1 },
  { day_of_week: 6, open_time: '09:00', close_time: '17:00', is_open: 1 }
]

const existingServices = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number }

if (existingServices.count === 0) {
  const insertService = db.prepare('INSERT INTO services (name, duration_minutes, price) VALUES (?, ?, ?)')
  for (const service of services) {
    insertService.run(service.name, service.duration_minutes, service.price)
  }
  console.log('Services seeded')
}

const existingBarbers = db.prepare('SELECT COUNT(*) as count FROM barbers').get() as { count: number }

if (existingBarbers.count === 0) {
  const insertBarber = db.prepare('INSERT INTO barbers (name) VALUES (?)')
  for (const barber of barbers) {
    insertBarber.run(barber.name)
  }
  console.log('Barbers seeded')
}

const existingHours = db.prepare('SELECT COUNT(*) as count FROM business_hours').get() as { count: number }

if (existingHours.count === 0) {
  const insertHours = db.prepare('INSERT INTO business_hours (day_of_week, open_time, close_time, is_open) VALUES (?, ?, ?, ?)')
  for (const hours of businessHours) {
    insertHours.run(hours.day_of_week, hours.open_time, hours.close_time, hours.is_open)
  }
  console.log('Business hours seeded')
}

const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }

if (existingUsers.count === 0) {
  const passwordHash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin')
  console.log('Admin user created (username: admin, password: admin123)')
}

console.log('Seed completed successfully!')
