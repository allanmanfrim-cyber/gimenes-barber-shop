import { Service, Barber, Appointment, BusinessHours, TimeSlot, User, Notification, NotificationStats, Payment, PaymentMethod } from '../types'
const API_URL = '/api'

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }))
    throw new Error(error.message || 'Erro na requisição')
  }

  return response.json()
}

export const api = {
  services: {
    list: () => fetchApi<{ services: Service[] }>('/services'),
    create: (data: Partial<Service>) =>
      fetchApi('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Service>) =>
      fetchApi(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchApi(`/admin/services/${id}`, { method: 'DELETE' })
  },

  barbers: {
    list: () => fetchApi<{ barbers: Barber[] }>('/barbers'),
    listAll: () => fetchApi<{ barbers: Barber[] }>('/admin/barbers'),
    create: (data: { name: string; whatsapp?: string; email?: string }) =>
      fetchApi<{ barber: Barber }>('/admin/barbers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Barber>) =>
      fetchApi(`/admin/barbers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  availability: {
    get: (barberId: string, date: string, serviceId: string) =>
      fetchApi<{ slots: TimeSlot[] }>(
        `/availability/${barberId}/${date}?serviceId=${serviceId}`
      )
  },

  appointments: {
    create: (data: {
      serviceId: string
      barberId: string | 'any'
      dateTime: string
      clientName: string
      clientWhatsapp: string
      clientEmail?: string
      clientBirthDate: string
      notes?: string
      referenceImages?: string[]
      paymentMethod: PaymentMethod
    }) => fetchApi<{ 
      appointment: Appointment
      pixCode?: string
      pixQrCodeBase64?: string
      checkoutUrl?: string
    }>(
      '/appointments',
      { method: 'POST', body: JSON.stringify(data) }
    ),
    get: (id: string) =>
      fetchApi<{ appointment: Appointment }>(`/appointments/${id}`),
    list: (date?: string, barberId?: string) => {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (barberId) params.append('barberId', barberId)
      return fetchApi<{ appointments: Appointment[] }>(
        `/admin/appointments?${params}`
      )
    },
    update: (id: string, data: Partial<Appointment>) =>
      fetchApi(`/admin/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancel: (id: string) =>
      fetchApi(`/admin/appointments/${id}`, { method: 'DELETE' })
  },

  payments: {
    list: () => fetchApi<{ payments: Payment[] }>('/admin/payments'),
    update: (id: string, data: Partial<Payment>) =>
      fetchApi(`/admin/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    confirmSimulation: (externalReference: string, method: string) =>
      fetchApi<{ success: boolean }>('/payments/confirm-simulation', {
        method: 'POST',
        body: JSON.stringify({ externalReference, method })
      })
  },

  notifications: {
    list: () => fetchApi<{ notifications: Notification[]; stats: NotificationStats }>('/admin/notifications'),
    stats: () => fetchApi<{ stats: NotificationStats }>('/admin/notifications/stats')
  },

  businessHours: {
    get: () => fetchApi<{ hours: BusinessHours[] }>('/business-hours'),
    update: (data: BusinessHours[]) =>
      fetchApi('/admin/business-hours', { method: 'PUT', body: JSON.stringify({ hours: data }) })
  },

  auth: {
    login: (username: string, password: string) =>
      fetchApi<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
  },

  admin: {
    inactiveClients: (days: number) => 
      fetchApi<{ clients: any[] }>(`/admin/inactive-clients?days=${days}`),
    birthdayClients: (date?: string) => {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      return fetchApi<{ clients: any[] }>(`/admin/birthday-clients?${params}`)
    },
    registerNoShow: (clientId: string) =>
      fetchApi(`/admin/clients/${clientId}/no-show`, { method: 'POST' }),
    clearPenalty: (clientId: string) =>
      fetchApi(`/admin/clients/${clientId}/clear-penalty`, { method: 'POST' })
  }
}

