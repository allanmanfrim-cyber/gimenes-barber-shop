import nodemailer from 'nodemailer'

const gmailUser = process.env.GMAIL_USER || ''
const gmailPassword = process.env.GMAIL_APP_PASSWORD || ''

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPassword
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const EmailService = {
  isConfigured: (): boolean => {
    return !!gmailUser && !!gmailPassword && gmailUser !== '' && gmailPassword !== ''
  },

  sendEmail: async (options: EmailOptions): Promise<{ success: boolean; error?: string }> => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'
    const businessEmail = process.env.BUSINESS_EMAIL || gmailUser

    if (!EmailService.isConfigured()) {
      console.log(`[SIMULACAO Email] Para: ${options.to}`)
      console.log(`[SIMULACAO Email] Assunto: ${options.subject}`)
      console.log(`[SIMULACAO Email] Conteudo: ${options.text || options.html}`)
      return { success: true }
    }

    try {
      await transporter.sendMail({
        from: `"${businessName}" <${businessEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      })

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao enviar email:', error.message)
      return { success: false, error: error.message }
    }
  }
}

export const EmailTemplates = {
  appointmentConfirmedClient: (data: {
    clientName: string
    serviceName: string
    barberName: string
    date: string
    time: string
    price: number
    paymentStatus: string
  }): { subject: string; html: string; text: string } => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'

    return {
      subject: `${businessName} - Agendamento Confirmado`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4a853 0%, #b8942d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .details-row:last-child { border-bottom: none; }
            .label { color: #666; }
            .value { font-weight: bold; color: #333; }
            .price { color: #d4a853; font-size: 1.2em; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; }
            .status.paid { background: #d4edda; color: #155724; }
            .status.pending { background: #fff3cd; color: #856404; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">${businessName}</h1>
              <p style="margin: 10px 0 0;">Agendamento Confirmado!</p>
            </div>
            <div class="content">
              <p>Ola, <strong>${data.clientName}</strong>!</p>
              <p>Seu agendamento foi confirmado com sucesso. Confira os detalhes:</p>
              
              <div class="details">
                <div class="details-row">
                  <span class="label">Servico</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Barbeiro</span>
                  <span class="value">${data.barberName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Data</span>
                  <span class="value">${data.date}</span>
                </div>
                <div class="details-row">
                  <span class="label">Horario</span>
                  <span class="value">${data.time}</span>
                </div>
                <div class="details-row">
                  <span class="label">Valor</span>
                  <span class="value price">R$ ${data.price.toFixed(2)}</span>
                </div>
                <div class="details-row">
                  <span class="label">Pagamento</span>
                  <span class="status ${data.paymentStatus.includes('Pago') ? 'paid' : 'pending'}">${data.paymentStatus}</span>
                </div>
              </div>
              
              <p>Aguardamos voce!</p>
              
              <div class="footer">
                <p>Este e-mail foi enviado automaticamente. Por favor, nao responda.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `${businessName} - Agendamento Confirmado

Ola, ${data.clientName}!

Seu agendamento foi confirmado com sucesso.

Detalhes:
- Servico: ${data.serviceName}
- Barbeiro: ${data.barberName}
- Data: ${data.date}
- Horario: ${data.time}
- Valor: R$ ${data.price.toFixed(2)}
- Pagamento: ${data.paymentStatus}

Aguardamos voce!`
    }
  },

  appointmentConfirmedBarber: (data: {
    barberName: string
    clientName: string
    clientWhatsapp: string
    serviceName: string
    date: string
    time: string
    price: number
    paymentStatus: string
    notes?: string
  }): { subject: string; html: string; text: string } => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'

    return {
      subject: `${businessName} - Novo Agendamento`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #333 0%, #555 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .details-row:last-child { border-bottom: none; }
            .label { color: #666; }
            .value { font-weight: bold; color: #333; }
            .notes { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Novo Agendamento</h1>
              <p style="margin: 10px 0 0;">${businessName}</p>
            </div>
            <div class="content">
              <p>Ola, <strong>${data.barberName}</strong>!</p>
              <p>Voce tem um novo agendamento:</p>
              
              <div class="details">
                <div class="details-row">
                  <span class="label">Cliente</span>
                  <span class="value">${data.clientName}</span>
                </div>
                <div class="details-row">
                  <span class="label">WhatsApp</span>
                  <span class="value">${data.clientWhatsapp}</span>
                </div>
                <div class="details-row">
                  <span class="label">Servico</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Data</span>
                  <span class="value">${data.date}</span>
                </div>
                <div class="details-row">
                  <span class="label">Horario</span>
                  <span class="value">${data.time}</span>
                </div>
                <div class="details-row">
                  <span class="label">Valor</span>
                  <span class="value">R$ ${data.price.toFixed(2)}</span>
                </div>
                <div class="details-row">
                  <span class="label">Pagamento</span>
                  <span class="value">${data.paymentStatus}</span>
                </div>
              </div>
              
              ${data.notes ? `<div class="notes"><strong>Observacoes:</strong> ${data.notes}</div>` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Novo Agendamento - ${businessName}

Ola, ${data.barberName}!

Voce tem um novo agendamento:

- Cliente: ${data.clientName}
- WhatsApp: ${data.clientWhatsapp}
- Servico: ${data.serviceName}
- Data: ${data.date}
- Horario: ${data.time}
- Valor: R$ ${data.price.toFixed(2)}
- Pagamento: ${data.paymentStatus}
${data.notes ? `- Observacoes: ${data.notes}` : ''}`
    }
  },

  appointmentCancelled: (data: {
    recipientName: string
    serviceName: string
    date: string
    time: string
    isClient: boolean
  }): { subject: string; html: string; text: string } => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'

    return {
      subject: `${businessName} - Agendamento Cancelado`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Agendamento Cancelado</h1>
            </div>
            <div class="content">
              <p>Ola, <strong>${data.recipientName}</strong>!</p>
              <p>${data.isClient ? 'Seu agendamento foi cancelado:' : 'O seguinte agendamento foi cancelado:'}</p>
              
              <div class="details">
                <p><strong>Servico:</strong> ${data.serviceName}</p>
                <p><strong>Data:</strong> ${data.date}</p>
                <p><strong>Horario:</strong> ${data.time}</p>
              </div>
              
              ${data.isClient ? '<p>Para reagendar, acesse nosso site.</p>' : ''}
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Agendamento Cancelado

Ola, ${data.recipientName}!

${data.isClient ? 'Seu agendamento foi cancelado:' : 'O seguinte agendamento foi cancelado:'}

- Servico: ${data.serviceName}
- Data: ${data.date}
- Horario: ${data.time}

${data.isClient ? 'Para reagendar, acesse nosso site.' : ''}`
    }
  }
}
