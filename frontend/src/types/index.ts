export type PaymentMethod =
  | "pix"
  | "credit_card"
  | "nubank"
  | "cash"
  | "machine"

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelado"

export type AppointmentStatus =
  | "pendente_pagamento"
  | "confirmado"
  | "cancelado"
  | "no_show"
  | "concluido"

export interface Barber {
  id: string
  name: string
  photo_url?: string
  whatsapp?: string
  email?: string
  instagram?: string
  active: boolean
  display_order?: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "barber"
  barberId?: string
  tenant_id?: number
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface NotificationStats {
  total: number
  unread: number
}

export interface Payment {
  id: string
  appointment_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  created_at: string
  qr_code?: string
  qr_code_base64?: string
  expiration_time?: string
}

export interface PaymentWithDetails extends Payment {
  client_name: string
  service_name: string
  date_time: string
}

export interface Service {
  id: number
  tenant_id: number
  name: string
  duration_minutes: number
  price: number
  active: boolean
}

export interface Client {
  id: number
  tenant_id: number
  name: string
  whatsapp: string
  email?: string
  data_nascimento?: string
  faltas_sem_aviso?: number
  status_multa?: string
  created_at: string
}

export interface Appointment {
  id: number
  tenant_id: number
  client_id: number
  barber_id: number
  service_id: number
  date_time: string
  status: AppointmentStatus
  notes?: string
  reference_images?: string | null
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

export interface TimeSlot {
  time: string
  available: boolean
}

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

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}





