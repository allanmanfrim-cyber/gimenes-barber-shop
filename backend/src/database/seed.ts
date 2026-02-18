import { db, initDatabase } from './init.js'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

initDatabase()

const services = [
  { name: 'Corte de Cabelo', duration_minutes: 30, price: 45.00 },
  { name: 'Barba', duration_minutes: 20, price: 30.00 },
  { name: 'Corte de Cabelo + Barba', duration_minutes: 60, price: 60.00 },
  { name: 'Corte cabelo + hidratação', duration_minutes: 50, price: 60.00 },
  { name: 'Corte de Cabelo + Barba + Hidratação', duration_minutes: 60, price: 75.00 },
  { name: 'Pézinho', duration_minutes: 15, price: 15.00 },
  { name: 'Sobrancelha', duration_minutes: 10, price: 10.00 },
  { name: 'Só Hidratação', duration_minutes: 30, price: 25.00 }
]

const barbers = [
  { name: 'Junior Gimenes', whatsapp: '17992195185' },
  { name: 'Abner William', whatsapp: '11948379063' }
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

for (const service of services) {
  const existing = db.prepare('SELECT id FROM services WHERE name = ?').get(service.name) as { id: number }
  if (existing) {
    db.prepare('UPDATE services SET duration_minutes = ?, price = ? WHERE id = ?').run(service.duration_minutes, service.price, existing.id)
  } else {
    db.prepare('INSERT INTO services (name, duration_minutes, price) VALUES (?, ?, ?)').run(service.name, service.duration_minutes, service.price)
  }
}
console.log('Services synced')

for (const barber of barbers) {
  const existing = db.prepare('SELECT id FROM barbers WHERE name = ?').get(barber.name) as { id: number }
  if (existing) {
    db.prepare('UPDATE barbers SET whatsapp = ? WHERE id = ?').run(barber.whatsapp, existing.id)
  } else {
    db.prepare('INSERT INTO barbers (name, whatsapp) VALUES (?, ?)').run(barber.name, barber.whatsapp)
  }
}
console.log('Barbers synced')

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
