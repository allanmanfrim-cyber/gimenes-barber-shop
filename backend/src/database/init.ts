import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import { applyMigrations } from './migrations.js'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'barbershop.db')

export const db = new Database(dbPath)

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      price REAL NOT NULL,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      barber_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date_time DATETIME NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (barber_id) REFERENCES barbers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL UNIQUE,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      pix_code TEXT,
      external_reference TEXT,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      recipient_type TEXT NOT NULL,
      recipient_contact TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      sent_at DATETIME,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS business_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL UNIQUE,
      open_time TEXT NOT NULL,
      close_time TEXT NOT NULL,
      is_open INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS notification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      client_id INTEGER,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id)
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_time);
    CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_notifications_appointment ON notifications(appointment_id);
  `)

  applyMigrations()
  seedDatabase()

  console.log('Database initialized successfully')
}

function seedDatabase() {
  const services = [
    { name: 'Corte de Cabelo', duration_minutes: 30, price: 45.00 },
    { name: 'Barba', duration_minutes: 20, price: 30.00 },
    { name: 'Corte de Cabelo + Barba', duration_minutes: 60, price: 60.00 },
    { name: 'Corte cabelo + hidratação', duration_minutes: 60, price: 60.00 },
    { name: 'Corte de Cabelo + Barba + Hidratação', duration_minutes: 60, price: 75.00 },
    { name: 'Pézinho', duration_minutes: 15, price: 15.00 },
    { name: 'Sobrancelha', duration_minutes: 10, price: 10.00 },
    { name: 'Só Hidratação', duration_minutes: 30, price: 25.00 }
  ]

  const barbers = [
    { name: 'Juninho', whatsapp: '17992195185' },
    { name: 'Júnior Gimenes', whatsapp: '17992195185' },
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

  // Sync Services
  for (const service of services) {
    const existing = db.prepare('SELECT id FROM services WHERE name = ?').get(service.name) as { id: number }
    if (existing) {
      db.prepare('UPDATE services SET duration_minutes = ?, price = ? WHERE id = ?').run(service.duration_minutes, service.price, existing.id)
    } else {
      db.prepare('INSERT INTO services (name, duration_minutes, price) VALUES (?, ?, ?)').run(service.name, service.duration_minutes, service.price)
    }
  }

  // Sync Barbers
  for (const barber of barbers) {
    const existing = db.prepare('SELECT id FROM barbers WHERE name = ?').get(barber.name) as { id: number }
    if (existing) {
      db.prepare('UPDATE barbers SET whatsapp = ? WHERE id = ?').run(barber.whatsapp, existing.id)
    } else {
      db.prepare('INSERT INTO barbers (name, whatsapp) VALUES (?, ?)').run(barber.name, barber.whatsapp)
    }
  }

  // Sync Business Hours
  const existingHours = db.prepare('SELECT COUNT(*) as count FROM business_hours').get() as { count: number }
  if (existingHours.count === 0) {
    const insertHours = db.prepare('INSERT INTO business_hours (day_of_week, open_time, close_time, is_open) VALUES (?, ?, ?, ?)')
    for (const hours of businessHours) {
      insertHours.run(hours.day_of_week, hours.open_time, hours.close_time, hours.is_open)
    }
  }

  // Sync Admin User
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('admin123', 10)
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin')
    console.log('Admin user created: admin / admin123')
  }
}
