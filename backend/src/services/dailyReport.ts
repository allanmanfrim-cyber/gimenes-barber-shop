import { db } from '../database/init.js'
import nodemailer from 'nodemailer'

interface DailyAppointment {
  barber_name: string
  client_name: string
  service_name: string
  price: number
  payment_method: string
  payment_status: string
  status: string
  date_time: string
}

interface BarberSummary {
  name: string
  totalServices: number
  totalRevenue: number
  byPaymentMethod: Record<string, { count: number; total: number }>
  cancellations: number
}

function getTodayAppointments(): DailyAppointment[] {
  const today = new Date().toISOString().split('T')[0]
  return db.prepare(`
    SELECT 
      b.name as barber_name,
      c.name as client_name,
      s.name as service_name,
      s.price,
      COALESCE(p.method, 'nao_informado') as payment_method,
      COALESCE(p.status, 'pending') as payment_status,
      a.status,
      a.date_time
    FROM appointments a
    JOIN barbers b ON a.barber_id = b.id
    JOIN clients c ON a.client_id = c.id
    JOIN services s ON a.service_id = s.id
    LEFT JOIN payments p ON p.appointment_id = a.id
    WHERE DATE(a.date_time) = ?
    ORDER BY b.name, a.date_time
  `).all(today) as DailyAppointment[]
}

function buildBarberSummaries(appointments: DailyAppointment[]): BarberSummary[] {
  const barberMap = new Map<string, BarberSummary>()

  for (const apt of appointments) {
    if (!barberMap.has(apt.barber_name)) {
      barberMap.set(apt.barber_name, {
        name: apt.barber_name,
        totalServices: 0,
        totalRevenue: 0,
        byPaymentMethod: {},
        cancellations: 0
      })
    }

    const summary = barberMap.get(apt.barber_name)!

    if (apt.status === 'cancelled') {
      summary.cancellations++
      continue
    }

    if (apt.status === 'completed' || apt.status === 'confirmed' || apt.status === 'pending') {
      summary.totalServices++
      summary.totalRevenue += apt.price

      const method = formatPaymentMethod(apt.payment_method)
      if (!summary.byPaymentMethod[method]) {
        summary.byPaymentMethod[method] = { count: 0, total: 0 }
      }
      summary.byPaymentMethod[method].count++
      summary.byPaymentMethod[method].total += apt.price
    }
  }

  return Array.from(barberMap.values())
}

function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    'pix': 'PIX',
    'credit_card': 'Cartao de Credito',
    'debit_card': 'Cartao de Debito',
    'local': 'Pagamento no Salao',
    'nao_informado': 'Nao Informado'
  }
  return methods[method] || method
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

function buildEmailHTML(summaries: BarberSummary[], appointments: DailyAppointment[]): string {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const totalGeral = summaries.reduce((acc, s) => acc + s.totalRevenue, 0)
  const totalServicos = summaries.reduce((acc, s) => acc + s.totalServices, 0)
  const totalCancelamentos = summaries.reduce((acc, s) => acc + s.cancellations, 0)

  let html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #c9a84c, #b8963f); padding: 24px; text-align: center;">
      <h1 style="color: #1a1a2e; margin: 0; font-size: 22px;">Gimenes Barber Shop</h1>
      <p style="color: #1a1a2e; margin: 8px 0 0; font-size: 14px;">Relatorio Diario - ${today}</p>
    </div>

    <div style="padding: 24px;">
      <div style="background: #16213e; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: #c9a84c; margin: 0 0 12px; font-size: 18px;">Resumo Geral</h2>
        <div style="display: flex; justify-content: space-around;">
          <div>
            <p style="color: #888; margin: 0; font-size: 12px;">TOTAL DO DIA</p>
            <p style="color: #c9a84c; font-size: 24px; font-weight: bold; margin: 4px 0;">${formatCurrency(totalGeral)}</p>
          </div>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: space-around;">
          <div>
            <p style="color: #888; margin: 0; font-size: 12px;">Servicos</p>
            <p style="color: #e0e0e0; font-size: 18px; margin: 4px 0;">${totalServicos}</p>
          </div>
          <div>
            <p style="color: #888; margin: 0; font-size: 12px;">Cancelamentos</p>
            <p style="color: ${totalCancelamentos > 0 ? '#ff6b6b' : '#4ecdc4'}; font-size: 18px; margin: 4px 0;">${totalCancelamentos}</p>
          </div>
        </div>
      </div>`

  for (const summary of summaries) {
    html += `
      <div style="background: #16213e; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: #c9a84c; margin: 0 0 12px; font-size: 16px;">${summary.name}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #888;">Servicos realizados:</span>
          <span style="color: #e0e0e0; font-weight: bold;">${summary.totalServices}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #888;">Faturamento:</span>
          <span style="color: #c9a84c; font-weight: bold;">${formatCurrency(summary.totalRevenue)}</span>
        </div>`

    if (summary.cancellations > 0) {
      html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #888;">Cancelamentos:</span>
          <span style="color: #ff6b6b; font-weight: bold;">${summary.cancellations}</span>
        </div>`
    }

    html += `<hr style="border-color: #2a2a4a; margin: 12px 0;">`
    html += `<p style="color: #888; font-size: 12px; margin: 0 0 8px;">Por forma de pagamento:</p>`

    for (const [method, data] of Object.entries(summary.byPaymentMethod)) {
      html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #aaa; font-size: 13px;">${method} (${data.count}x)</span>
          <span style="color: #e0e0e0; font-size: 13px;">${formatCurrency(data.total)}</span>
        </div>`
    }

    html += `</div>`
  }

  if (appointments.filter(a => a.status === 'cancelled').length > 0) {
    html += `
      <div style="background: #16213e; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: #ff6b6b; margin: 0 0 12px; font-size: 16px;">Cancelamentos do Dia</h3>`

    for (const apt of appointments.filter(a => a.status === 'cancelled')) {
      const hora = new Date(apt.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      html += `
        <div style="margin-bottom: 8px; padding: 8px; background: #1a1a2e; border-radius: 4px;">
          <span style="color: #e0e0e0;">${apt.client_name}</span>
          <span style="color: #888;"> - ${apt.service_name} as ${hora}</span>
          <span style="color: #888;"> (${apt.barber_name})</span>
        </div>`
    }
    html += `</div>`
  }

  if (summaries.length === 0) {
    html += `
      <div style="background: #16213e; border-radius: 8px; padding: 24px; text-align: center;">
        <p style="color: #888; margin: 0;">Nenhum atendimento registrado hoje.</p>
      </div>`
  }

  html += `
      <p style="text-align: center; color: #555; font-size: 11px; margin-top: 20px;">
        Relatorio gerado automaticamente pelo sistema Gimenes Barber Shop
      </p>
    </div>
  </div>`

  return html
}

export async function sendDailyReport(): Promise<void> {
  const recipientEmail = process.env.REPORT_EMAIL || 'junior.gimenes2396@gmail.com'
  const senderEmail = process.env.SMTP_USER || ''
  const senderPassword = process.env.SMTP_PASS || ''

  if (!senderEmail || !senderPassword) {
    console.log('SMTP credentials not configured. Skipping daily report.')
    return
  }

  const appointments = getTodayAppointments()
  const summaries = buildBarberSummaries(appointments)
  const html = buildEmailHTML(summaries, appointments)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPassword
    }
  })

  const today = new Date().toLocaleDateString('pt-BR')

  await transporter.sendMail({
    from: `"Gimenes Barber Shop" <${senderEmail}>`,
    to: recipientEmail,
    subject: `Relatorio Diario - ${today} - Gimenes Barber Shop`,
    html
  })

  console.log(`Daily report sent to ${recipientEmail}`)
}
