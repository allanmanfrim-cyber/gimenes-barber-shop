export interface Service {
  id: number
  tenant_id: number
  name: string
  duration_minutes: number
  price: number
  active: boolean
}

export interface Barber {
  id: number
  tenant_id: number
  name: string
  active: boolean
  display_order: number
}

export interface Client {
  id: number
  tenant_id: number
  name: string
  whatsapp: string
  email?: string
  data_nascimento?: string
  faltas_sem_aviso?: number
  status_multa?: boolean
  created_at: string
}

export interface Appointment {
  id: number
  tenant_id: number
  client_id: number
  barber_id: number
  service_id: number
  date_time: string
  status: 'pendente_pagamento' | 'confirmado' | 'cancelado' | 'no_show' | 'concluido'
  notes?: string
  reference_images?: string | null
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

export interface Payment {
  id: number
  tenant_id: number
  appointment_id: number
  metodo_visual: 'pix' | 'nubank' | 'cartao' | 'dinheiro_local' | 'cartao_local' | 'pix_local'
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
  qr_code?: string
  qr_code_base64?: string
  expiration_time?: string
}

export interface BusinessHours {
  id: number
  tenant_id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
}

// Atualizado para refletir o estado do useBooking
export type PaymentMethod = 'pix' | 'nubank' | 'card' | 'local'
export type PaymentType = 'online' | 'presencial'

export interface BookingData {
  service: Service | null
  barber: Barber | null
  date: string
  time: string
  clientName: string
  clientWhatsapp: string
  clientEmail: string
  clientBirthDate: string
  notes: string
  referenceImages: string[]
  paymentMethod: PaymentMethod
  paymentType: PaymentType
}

export interface User {
  id: number
  username: string
  role: string
  tenant_id: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
