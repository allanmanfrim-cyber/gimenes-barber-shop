import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || ''

const client = new MercadoPagoConfig({ 
  accessToken,
  options: { timeout: 5000 }
})

const payment = new Payment(client)
const preference = new Preference(client)

export interface PixPaymentResult {
  id: string
  qrCode: string
  qrCodeBase64: string
  externalReference: string
}

export interface CardCheckoutResult {
  preferenceId: string
  initPoint: string
  externalReference: string
}

export const MercadoPagoService = {
  isConfigured: (): boolean => {
    return !!accessToken && accessToken !== ''
  },

  createPixPayment: async (
    amount: number,
    appointmentId: number,
    clientEmail?: string
  ): Promise<PixPaymentResult> => {
    if (!MercadoPagoService.isConfigured()) {
      return MercadoPagoService.simulatePixPayment(amount, appointmentId)
    }

    const externalReference = `appointment_${appointmentId}_${Date.now()}`

    try {
      const response = await payment.create({
        body: {
          transaction_amount: amount,
          description: `Agendamento Gimenes Barber Shop #${appointmentId}`,
          payment_method_id: 'pix',
          payer: {
            email: clientEmail || 'cliente@gimenes.com'
          },
          external_reference: externalReference
        }
      })

      return {
        id: String(response.id),
        qrCode: response.point_of_interaction?.transaction_data?.qr_code || '',
        qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        externalReference
      }
    } catch (error) {
      console.error('Erro ao criar pagamento Pix:', error)
      return MercadoPagoService.simulatePixPayment(amount, appointmentId)
    }
  },

  createCardCheckout: async (
    amount: number,
    appointmentId: number,
    serviceName: string,
    clientEmail?: string
  ): Promise<CardCheckoutResult> => {
    if (!MercadoPagoService.isConfigured()) {
      return MercadoPagoService.simulateCardCheckout(amount, appointmentId)
    }

    const externalReference = `appointment_${appointmentId}_${Date.now()}`
    const backUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    try {
      const response = await preference.create({
        body: {
          items: [
            {
              id: `service_${appointmentId}`,
              title: serviceName,
              quantity: 1,
              unit_price: amount,
              currency_id: 'BRL'
            }
          ],
          payer: {
            email: clientEmail || 'cliente@gimenes.com'
          },
          external_reference: externalReference,
          back_urls: {
            success: `${backUrl}/booking/success?ref=${externalReference}`,
            failure: `${backUrl}/booking/failure?ref=${externalReference}`,
            pending: `${backUrl}/booking/pending?ref=${externalReference}`
          },
          auto_return: 'approved',
          notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`
        }
      })

      return {
        preferenceId: response.id || '',
        initPoint: response.init_point || '',
        externalReference
      }
    } catch (error) {
      console.error('Erro ao criar checkout de cartao:', error)
      return MercadoPagoService.simulateCardCheckout(amount, appointmentId)
    }
  },

  getPaymentStatus: async (paymentId: string): Promise<string> => {
    if (!MercadoPagoService.isConfigured()) {
      return 'approved'
    }

    try {
      const response = await payment.get({ id: paymentId })
      return response.status || 'unknown'
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error)
      return 'unknown'
    }
  },

  processWebhook: async (data: { action?: string; data?: { id?: string }; type?: string }): Promise<{
    success: boolean
    paymentId?: string
    status?: string
    externalReference?: string
  }> => {
    if (!data.data?.id) {
      return { success: false }
    }

    if (!MercadoPagoService.isConfigured()) {
      return { 
        success: true, 
        paymentId: data.data.id,
        status: 'approved',
        externalReference: ''
      }
    }

    try {
      const response = await payment.get({ id: data.data.id })
      
      return {
        success: true,
        paymentId: String(response.id),
        status: response.status || 'unknown',
        externalReference: response.external_reference || ''
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      return { success: false }
    }
  },

  simulatePixPayment: (amount: number, appointmentId: number): PixPaymentResult => {
    const externalReference = `appointment_${appointmentId}_${Date.now()}`
    const pixKey = process.env.PIX_KEY || 'gimenes@barbershop.com'
    const merchantName = process.env.BUSINESS_NAME || 'GIMENES BARBER SHOP'
    const city = 'SAO PAULO'
    const txId = `AGEND${appointmentId.toString().padStart(8, '0')}`
    
    const payload = [
      '000201',
      '010212',
      `26${(4 + pixKey.length + 22).toString().padStart(2, '0')}`,
      '0014BR.GOV.BCB.PIX',
      `01${pixKey.length.toString().padStart(2, '0')}${pixKey}`,
      '52040000',
      '5303986',
      `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}`,
      '5802BR',
      `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
      `60${city.length.toString().padStart(2, '0')}${city}`,
      `62${(4 + txId.length + 4).toString().padStart(2, '0')}`,
      `05${txId.length.toString().padStart(2, '0')}${txId}`,
      '6304'
    ].join('')

    const crc = calculateCRC16(payload)
    const qrCode = payload + crc

    return {
      id: `sim_${Date.now()}`,
      qrCode,
      qrCodeBase64: '',
      externalReference
    }
  },

  simulateCardCheckout: (amount: number, appointmentId: number): CardCheckoutResult => {
    const externalReference = `appointment_${appointmentId}_${Date.now()}`
    return {
      preferenceId: `sim_pref_${Date.now()}`,
      initPoint: `http://localhost:5173/booking/simulate-payment?amount=${amount}&ref=${externalReference}`,
      externalReference
    }
  }
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF
  const polynomial = 0x1021

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc <<= 1
      }
      crc &= 0xFFFF
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}
