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

  
  // 5. Add tenant_config table
  tryExec(`CREATE TABLE IF NOT EXISTS tenant_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT DEFAULT "default",
    nome_barbearia TEXT,
    logotipo_url TEXT,
    favicon_url TEXT,
    cor_primaria TEXT DEFAULT "#eab308",
    cor_secundaria TEXT DEFAULT "#171717",
    cor_fundo TEXT DEFAULT "#0a0a0a",
    modo_tema TEXT DEFAULT "escuro",
    whatsapp TEXT,
    telefone TEXT,
    instagram TEXT,
    endereco TEXT,
    horario_funcionamento TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );`, "tenant_config table")

  // 4. Add whatsapp to barbers
  tryExec(`ALTER TABLE barbers ADD COLUMN whatsapp TEXT;`, "whatsapp to barbers")

  // 3. Update service durations
  try {
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Corte de Cabelo + Barba'").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Cabelo + Hidratação'").run()
    db.prepare("UPDATE services SET duration_minutes = 60 WHERE name = 'Cabelo + Barba + Hidratação'").run()
    console.log("Migration: Updated service durations")
  } catch (error: any) {
    console.error("Migration: Error updating service durations:", error?.message || error)
  }
}

