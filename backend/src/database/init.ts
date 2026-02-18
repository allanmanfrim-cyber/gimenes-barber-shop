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
    CREATE INDEX IF NOT EXISTS idx_payments_external ON payments(external_reference);
  `)

  runMigrations()
  applyMigrations()
  seedTestUsers()

  console.log('Database initialized successfully')
}

function runMigrations() {
  const migrations = [
    { name: 'add_barber_contacts', sql: 'ALTER TABLE barbers ADD COLUMN whatsapp TEXT' },
    { name: 'add_barber_email', sql: 'ALTER TABLE barbers ADD COLUMN email TEXT' },
    { name: 'add_client_email', sql: 'ALTER TABLE clients ADD COLUMN email TEXT' },
    { name: 'add_payment_external_ref', sql: 'ALTER TABLE payments ADD COLUMN external_reference TEXT' },
    { name: 'add_payment_paid_at', sql: 'ALTER TABLE payments ADD COLUMN paid_at DATETIME' },
  ]

  for (const migration of migrations) {
    try {
      db.exec(migration.sql)
    } catch {
    }
  }
}

function seedTestUsers() {
  const testUsers = [
    { username: 'allan_barbeiro', password: 'senha123', role: 'admin' },
    { username: 'cliente_teste', password: 'senha123', role: 'client' }
  ]

  for (const user of testUsers) {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(user.username)
    if (!existing) {
      const passwordHash = bcrypt.hashSync(user.password, 10)
      db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(user.username, passwordHash, user.role)
      console.log(`Usuario de teste criado: ${user.username} (${user.role})`)
    }
  }
}
