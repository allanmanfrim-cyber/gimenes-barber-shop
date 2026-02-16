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
  phone?: string
  photo_url?: string
  active: boolean
}

export interface Client {
  id: number
  name: string
  whatsapp: string
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
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

export interface Payment {
  id: number
  appointment_id: number
  method: 'pix' | 'local'
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled'
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
  services: Service[]
  barber: Barber | null
  date: string
  time: string
  clientName: string
  clientWhatsapp: string
  notes: string
  paymentMethod: 'pix' | 'local'
}

export interface User {
  id: number
  username: string
  role: 'admin' | 'barber'
  barberId?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
