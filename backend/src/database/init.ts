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

// 🔥 RESET TEMPORÁRIO DO BANCO (REMOVE DEPOIS)
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
  console.log('Old database deleted')
}

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
      tenant_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 99,
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

    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_time);
    CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
  `)

  applyMigrations()
  seedDatabase()

  console.log('Database initialized successfully')
}

function seedDatabase() {
  const services = [
    { name: 'Corte de Cabelo', duration_minutes: 30, price: 45.00 },
    { name: 'Barba', duration_minutes: 20, price: 30.00 }
  ]

  const barbers = [
    { name: 'Júnior Gimenes', whatsapp: '17992195185' },
    { name: 'Abner William', whatsapp: '11948379063' }
  ]

  for (const service of services) {
    db.prepare(`
      INSERT INTO services (name, duration_minutes, price)
      VALUES (?, ?, ?)
    `).run(service.name, service.duration_minutes, service.price)
  }

  for (const barber of barbers) {
    db.prepare(`
      INSERT INTO barbers (name, whatsapp, tenant_id, display_order)
      VALUES (?, ?, 1, 99)
    `).run(barber.name, barber.whatsapp)
  }

  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('*Am.71692432', 10)
    db.prepare(`
      INSERT INTO users (username, password_hash, role)
      VALUES (?, ?, ?)
    `).run('admin', passwordHash, 'admin')
  }
}