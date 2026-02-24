import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'barbershop.db')

// ⚠️ REMOVER EM PRODUÇÃO SE NÃO QUISER RESETAR SEMPRE
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
      tenant_id INTEGER DEFAULT 1,
      client_id INTEGER NOT NULL,
      barber_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date_time DATETIME NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      reference_images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL UNIQUE,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
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

  seedDatabase()

  console.log('Database initialized successfully')
}

function seedDatabase() {

  // Services
  db.prepare(`
    INSERT INTO services (name, duration_minutes, price)
    VALUES ('Corte de Cabelo', 30, 45.00)
  `).run()

  db.prepare(`
    INSERT INTO services (name, duration_minutes, price)
    VALUES ('Barba', 20, 30.00)
  `).run()

  // Barbers
  db.prepare(`
    INSERT INTO barbers (name, whatsapp, tenant_id, display_order)
    VALUES ('Júnior Gimenes', '17992195185', 1, 99)
  `).run()

  db.prepare(`
    INSERT INTO barbers (name, whatsapp, tenant_id, display_order)
    VALUES ('Abner William', '11948379063', 1, 99)
  `).run()

  // Business Hours
  const defaultHours = [
    { day: 0, open: '00:00', close: '00:00', isOpen: 0 },
    { day: 1, open: '09:00', close: '20:00', isOpen: 1 },
    { day: 2, open: '09:00', close: '20:00', isOpen: 1 },
    { day: 3, open: '09:00', close: '20:00', isOpen: 1 },
    { day: 4, open: '09:00', close: '20:00', isOpen: 1 },
    { day: 5, open: '09:00', close: '20:00', isOpen: 1 },
    { day: 6, open: '08:00', close: '18:00', isOpen: 1 }
  ]

  for (const h of defaultHours) {
    db.prepare(`
      INSERT INTO business_hours (day_of_week, open_time, close_time, is_open)
      VALUES (?, ?, ?, ?)
    `).run(h.day, h.open, h.close, h.isOpen)
  }

  // Admin
  const passwordHash = bcrypt.hashSync('*Am.71692432', 10)

  db.prepare(`
    INSERT INTO users (username, password_hash, role)
    VALUES ('admin', ?, 'admin')
  `).run(passwordHash)

  console.log('Seed completed')
}