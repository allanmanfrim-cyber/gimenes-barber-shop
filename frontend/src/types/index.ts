export interface Service {
  id: number
  name: string
  duration_minutes: number
  price: number
  active: boolean
}

export interface Barber {
  id: number
  name: string
  whatsapp?: string
  email?: string
  photo_url?: string
  active: boolean
}

export interface Client {
  id: number
  name: string
  whatsapp: string
  email?: string
  data_nascimento?: string
  faltas_sem_aviso?: number
  status_multa?: 'nenhuma' | 'ativa' | 'paga' | 'pendente'
  created_at: string
}

export interface Appointment {
  id: number
  client_id: number
  barber_id: number
  service_id: number
  date_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  reference_images?: string
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

export type PaymentMethod = 'pix' | 'nubank' | 'card' | 'machine' | 'cash' | 'local'
export type PaymentType = 'online' | 'presencial'
export type PaymentStatus = 'pending' | 'paid_pix' | 'paid_card' | 'paid_nubank' | 'pay_on_site' | 'cancelled'

export interface Payment {
  id: number
  appointment_id: number
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  external_reference?: string
  paid_at?: string
}

export interface BusinessHours {
  id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
}

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
  barberId?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface Notification {
  id: number
  appointment_id: number
  type: 'whatsapp' | 'email'
  recipient_type: 'client' | 'barber'
  recipient_contact: string
  status: 'pending' | 'sent' | 'failed'
  sent_at?: string
  error_message?: string
  created_at: string
}

export interface NotificationStats {
  total: number
  sent: number
  failed: number
  pending: number
}
