import { db } from './init.js'

export function applyMigrations() {
  try {
    // 1. Add reference_images to appointments
    db.exec(`ALTER TABLE appointments ADD COLUMN reference_images TEXT;`)
    console.log('Migration: Added reference_images to appointments')
  } catch (error) {
    const e = error as any
    console.log('Migration: reference_images already exists or error:', e?.message || e)
  }

  try {
    // 2. Add new fields to clients
    db.exec(`ALTER TABLE clients ADD COLUMN data_nascimento DATE;`)
    db.exec(`ALTER TABLE clients ADD COLUMN faltas_sem_aviso INTEGER DEFAULT 0;`)
    db.exec(`ALTER TABLE clients ADD COLUMN status_multa TEXT DEFAULT 'nenhuma';`)
    console.log('Migration: Added new fields to clients')
  } catch (error) {
    const e = error as any
    console.log('Migration: client fields already exist or error:', e?.message || e)
  }

  try {
    // 4. Add whatsapp to barbers
    db.exec(`ALTER TABLE barbers ADD COLUMN whatsapp TEXT;`)
    console.log('Migration: Added whatsapp to barbers')
  } catch (error) {
    const e = error as any
    console.log('Migration: whatsapp for barbers already exists or error:', e?.message || e)
  }

  // 3. Update service durations
  try {
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Corte de Cabelo + Barba'").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Corte cabelo + hidratação'").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Corte de Cabelo + Barba + Hidratação'").run()
    console.log('Migration: Updated service durations')
  } catch (error) {
    const e = error as any
    console.error('Migration: Error updating service durations:', e?.message || e)
  }
}
