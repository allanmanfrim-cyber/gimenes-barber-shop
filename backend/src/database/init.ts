function seedDatabase() {

  // ===============================
  // SERVICES
  // ===============================

  const services = [
    { name: 'Corte de Cabelo', duration_minutes: 30, price: 45.00 },
    { name: 'Barba', duration_minutes: 20, price: 30.00 }
  ]

  for (const service of services) {
    db.prepare(`
      INSERT INTO services (name, duration_minutes, price)
      VALUES (?, ?, ?)
    `).run(service.name, service.duration_minutes, service.price)
  }

  // ===============================
  // BARBERS
  // ===============================

  const barbers = [
    { name: 'Júnior Gimenes', whatsapp: '17992195185' },
    { name: 'Abner William', whatsapp: '11948379063' }
  ]

  for (const barber of barbers) {
    db.prepare(`
      INSERT INTO barbers (name, whatsapp, tenant_id, display_order)
      VALUES (?, ?, 1, 99)
    `).run(barber.name, barber.whatsapp)
  }

  // ===============================
  // BUSINESS HOURS (CORREÇÃO AQUI)
  // ===============================

  const defaultHours = [
    { day: 0, open: '00:00', close: '00:00', isOpen: 0 }, // Domingo fechado
    { day: 1, open: '09:00', close: '20:00', isOpen: 1 }, // Segunda
    { day: 2, open: '09:00', close: '20:00', isOpen: 1 }, // Terça
    { day: 3, open: '09:00', close: '20:00', isOpen: 1 }, // Quarta
    { day: 4, open: '09:00', close: '20:00', isOpen: 1 }, // Quinta
    { day: 5, open: '09:00', close: '20:00', isOpen: 1 }, // Sexta
    { day: 6, open: '08:00', close: '18:00', isOpen: 1 }  // Sábado
  ]

  for (const h of defaultHours) {
    db.prepare(`
      INSERT INTO business_hours (day_of_week, open_time, close_time, is_open)
      VALUES (?, ?, ?, ?)
    `).run(h.day, h.open, h.close, h.isOpen)
  }

  // ===============================
  // ADMIN USER
  // ===============================

  const existingAdmin = db.prepare(
    'SELECT id FROM users WHERE username = ?'
  ).get('admin')

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('*Am.71692432', 10)
    db.prepare(`
      INSERT INTO users (username, password_hash, role)
      VALUES (?, ?, ?)
    `).run('admin', passwordHash, 'admin')
  }

  console.log('Seed completed successfully')
}