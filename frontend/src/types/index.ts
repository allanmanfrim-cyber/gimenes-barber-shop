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
  | "cancelled"

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
  tenant_id?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: string
  recipient_type?: string
  recipient_contact?: string
  error_message?: string
  sent_at?: string
  created_at: string
  read?: boolean
}

export interface NotificationStats {
  total: number
  unread: number
  sent: number
  failed: number
  pending: number
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
  id: string
  tenant_id: string
  name: string
  duration_minutes: number
  price: number
  active: boolean
}

export interface Client {
  id: string
  tenant_id: string
  name: string
  whatsapp: string
  email?: string
  data_nascimento?: string
  faltas_sem_aviso?: number
  status_multa?: string
  created_at: string
}

export interface Appointment {
  id: string
  tenant_id: string
  client_id: string
  barber_id: string
  service_id: string
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

export interface BusinessHours {
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean | number
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

