import { db, initDatabase } from './init.js'

console.log('Inicializando banco de dados para garantir estrutura base...')
initDatabase()

console.log('Iniciando migracao segura do Core...')

// Helper para verificar e adicionar colunas
function addColumnIfNotExists(table: string, column: string, definition: string) {
  try {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    const exists = columns.some(c => c.name === column);
    if (!exists) {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
      console.log(`[OK] Coluna ${column} adicionada em ${table}`);
    } else {
        console.log(`[SKIP] Coluna ${column} ja existe em ${table}`);
    }
  } catch (error) {
    console.error(`[ERRO] Falha ao alterar ${table}:`, error);
  }
}

// 1. TENANT_ID (Multi-tenancy)
const tables = ['services', 'barbers', 'clients', 'appointments', 'payments', 'users', 'business_hours'];
tables.forEach(table => {
  addColumnIfNotExists(table, 'tenant_id', 'INTEGER DEFAULT 1');
});

// 2. USUARIOS (Auth & Perfil)
addColumnIfNotExists('users', 'email', 'TEXT UNIQUE');
addColumnIfNotExists('users', 'nome', 'TEXT');
addColumnIfNotExists('users', 'ativo', 'INTEGER DEFAULT 1');
addColumnIfNotExists('users', 'ultimo_login', 'DATETIME');

// 3. AGENDAMENTOS (Novos Status)
try {
    db.prepare("UPDATE appointments SET status = 'pendente_pagamento' WHERE status = 'pending'").run();
    db.prepare("UPDATE appointments SET status = 'concluido' WHERE status = 'completed'").run();
    db.prepare("UPDATE appointments SET status = 'cancelado' WHERE status = 'cancelled'").run();
    console.log('[OK] Status de agendamentos migrados');
} catch (e) {
    console.error('[ERRO] Falha ao migrar status:', e);
}

// 4. PAGAMENTOS (Motor de Pagamento)
addColumnIfNotExists('payments', 'payment_id', 'TEXT');
addColumnIfNotExists('payments', 'expiration_time', 'DATETIME');
addColumnIfNotExists('payments', 'metodo_visual', 'TEXT');
addColumnIfNotExists('payments', 'metodo_gateway_real', 'TEXT');
addColumnIfNotExists('payments', 'qr_code', 'TEXT');
addColumnIfNotExists('payments', 'qr_code_base64', 'TEXT');

// Atualizar pagamentos antigos
try {
    db.prepare("UPDATE payments SET metodo_visual = method WHERE metodo_visual IS NULL").run();
    console.log('[OK] Dados de pagamento migrados');
} catch (e) {
    console.error('[ERRO] Falha ao migrar dados de pagamento:', e);
}

console.log('Migracao concluida com sucesso!')
