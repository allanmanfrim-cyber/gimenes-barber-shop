import cron from 'node-cron'
import { ClientModel } from '../models/Client.js'
import { db } from '../database/init.js'
import { WhatsAppService } from './whatsappService.js'

export async function sendBirthdayGreetings() {
  console.log('Running birthday greetings service...')
  try {
    const clients = ClientModel.findBirthdays()
    console.log(`Found ${clients.length} birthdays today`)

    for (const client of clients) {
      const message = `Feliz aniversario, ${client.name.split(' ')[0]}! 🎉\nQue tal aproveitar seu dia para renovar o visual? 💈\nAgende aqui: https://www.gimenesbarber.com.br`
      
      // Enviar WhatsApp real
      await WhatsAppService.sendMessage(client.whatsapp, message)

      // Log the notification
      db.prepare('INSERT INTO notification_logs (type, client_id, message, status) VALUES (?, ?, ?, ?)')
        .run('birthday', client.id, message, 'sent')
      
      console.log(`Birthday greeting sent and logged for ${client.name}`)
    }
  } catch (error) {
    console.error('Error in birthday greetings service:', error)
  }
}

export function setupBirthdayAutomation() {
  // Schedule at 09:00 every day
  cron.schedule('0 9 * * *', async () => {
    await sendBirthdayGreetings()
  }, {
    timezone: 'America/Sao_Paulo'
  })
  console.log('Birthday automation scheduled for 09:00 (Sao Paulo time)')
}
