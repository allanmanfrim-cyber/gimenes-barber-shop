import { db } from "./init.js"

export function applyMigrations() {
  const tryExec = (sql: string, name: string) => {
    try {
      db.exec(sql)
      console.log(`Migration: ${name} applied`)
    } catch (error: any) {
      console.log(`Migration: ${name} already exists or error:`, error?.message || error)
    }
  }

  // 1. Add reference_images to appointments
  tryExec(`ALTER TABLE appointments ADD COLUMN reference_images TEXT;`, "reference_images to appointments")

  // 2. Add new fields to clients
  tryExec(`ALTER TABLE clients ADD COLUMN data_nascimento DATE;`, "data_nascimento to clients")
  tryExec(`ALTER TABLE clients ADD COLUMN faltas_sem_aviso INTEGER DEFAULT 0;`, "faltas_sem_aviso to clients")
  tryExec(`ALTER TABLE clients ADD COLUMN status_multa TEXT DEFAULT \"nenhuma\";`, "status_multa to clients")

  // 4. Add whatsapp to barbers
  tryExec(`ALTER TABLE barbers ADD COLUMN whatsapp TEXT;`, "whatsapp to barbers")

  // 3. Update service durations
  try {
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = \"Corte de Cabelo + Barba\"").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = \"Corte cabelo + hidratação\"").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = \"Corte de Cabelo + Barba + Hidratação\"").run()
    console.log("Migration: Updated service durations")
  } catch (error: any) {
    console.error("Migration: Error updating service durations:", error?.message || error)
  }
}
