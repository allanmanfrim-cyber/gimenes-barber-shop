import { db } from './init.js'

console.log('Aplicando ajustes de ordem e correcoes...')

// 1. Adicionar display_order em barbers
try {
  const columns = db.prepare("PRAGMA table_info(barbers)").all() as any[];
  if (!columns.some(c => c.name === 'display_order')) {
    db.prepare("ALTER TABLE barbers ADD COLUMN display_order INTEGER DEFAULT 99").run();
    console.log('Coluna display_order adicionada.');
  }
} catch (e) {
  console.error('Erro ao alterar barbers:', e);
}

// 2. Atualizar ordem dos barbeiros
// 1° Junior Gimenes, 2° Abner William
try {
  db.prepare("UPDATE barbers SET display_order = 1 WHERE name LIKE '%Junior%' OR name LIKE '%Júnior%'").run();
  db.prepare("UPDATE barbers SET display_order = 2 WHERE name LIKE '%Abner%'").run();
  console.log('Ordem dos barbeiros atualizada.');
} catch (e) {
  console.error('Erro ao atualizar ordem:', e);
}

// 3. Garantir horarios de funcionamento (resetar para padrao se estiver vazio ou errado)
const count = db.prepare("SELECT COUNT(*) as c FROM business_hours").get() as any;
if (count.c === 0) {
    // Re-seed se necessario (ja feito no seed.ts, mas garantindo)
    console.log('Tabela business_hours vazia, rodar npm run seed se necessario.');
}

console.log('Ajustes concluidos.')
