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
    list: () => fetchApi<{ services: import('../types').Service[] }>('/services'),
    create: (data: Partial<import('../types').Service>) =>
      fetchApi('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('../types').Service>) =>
      fetchApi(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
      fetchApi(`/admin/services/${id}`, { method: 'DELETE' })
  },

  barbers: {
    list: () => fetchApi<{ barbers: import('../types').Barber[] }>('/barbers'),
    listAll: () => fetchApi<{ barbers: import('../types').Barber[] }>('/admin/barbers'),
    create: (data: { name: string; whatsapp?: string; email?: string }) =>
      fetchApi<{ barber: import('../types').Barber }>('/admin/barbers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<import('../types').Barber>) =>
      fetchApi(`/admin/barbers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  availability: {
    get: (barberId: number | string, date: string, serviceId: number) =>
      fetchApi<{ slots: import('../types').TimeSlot[] }>(
        `/availability/${barberId}/${date}?serviceId=${serviceId}`
      )
  },

  appointments: {
    create: (data: {
      serviceId: number
      barberId: number | 'any'
      dateTime: string
      clientName: string
      clientWhatsapp: string
      clientEmail?: string
      notes?: string
      paymentMethod: import('../types').PaymentMethod
    }) => fetchApi<{ 
      appointment: import('../types').Appointment
      pixCode?: string
      pixQrCodeBase64?: string
      checkoutUrl?: string
    }>(
      '/appointments',
      { method: 'POST', body: JSON.stringify(data) }
    ),
    get: (id: number) =>
      fetchApi<{ appointment: import('../types').Appointment }>(`/appointments/${id}`),
    list: (date?: string, barberId?: number) => {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (barberId) params.append('barberId', barberId.toString())
      return fetchApi<{ appointments: import('../types').Appointment[] }>(
        `/admin/appointments?${params}`
      )
    },
    update: (id: number, data: Partial<import('../types').Appointment>) =>
      fetchApi(`/admin/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancel: (id: number) =>
      fetchApi(`/admin/appointments/${id}`, { method: 'DELETE' })
  },

  payments: {
    list: () => fetchApi<{ payments: import('../types').Payment[] }>('/admin/payments'),
    update: (id: number, data: Partial<import('../types').Payment>) =>
      fetchApi(`/admin/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    confirmSimulation: (externalReference: string, method: string) =>
      fetchApi<{ success: boolean }>('/payments/confirm-simulation', {
        method: 'POST',
        body: JSON.stringify({ externalReference, method })
      })
  },

  notifications: {
    list: () => fetchApi<{ notifications: import('../types').Notification[]; stats: import('../types').NotificationStats }>('/admin/notifications'),
    stats: () => fetchApi<{ stats: import('../types').NotificationStats }>('/admin/notifications/stats')
  },

  businessHours: {
    get: () => fetchApi<{ hours: import('../types').BusinessHours[] }>('/business-hours'),
    update: (data: import('../types').BusinessHours[]) =>
      fetchApi('/admin/business-hours', { method: 'PUT', body: JSON.stringify({ hours: data }) })
  },

  auth: {
    login: (username: string, password: string) =>
      fetchApi<{ token: string; user: import('../types').User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
  }
}
