import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PaymentWithDetails {
  id: number
  appointment_id: number
  method: string
  amount: number
  status: string
  date_time: string
  client_name: string
  service_name: string
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setPayments(data.payments)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      })
      loadPayments()
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-dark-600 text-dark-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <AdminLayout title="Pagamentos">
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-dark-400 p-6">Carregando...</p>
        ) : payments.length === 0 ? (
          <p className="text-dark-400 p-6">Nenhum pagamento registrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700/50">
                <tr>
                  <th className="text-left text-dark-300 font-medium p-4">Data</th>
                  <th className="text-left text-dark-300 font-medium p-4">Cliente</th>
                  <th className="text-left text-dark-300 font-medium p-4">Servico</th>
                  <th className="text-left text-dark-300 font-medium p-4">Metodo</th>
                  <th className="text-left text-dark-300 font-medium p-4">Valor</th>
                  <th className="text-left text-dark-300 font-medium p-4">Status</th>
                  <th className="text-right text-dark-300 font-medium p-4">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="p-4 text-dark-300">
                      {payment.date_time && format(new Date(payment.date_time), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="p-4 text-white">{payment.client_name}</td>
                    <td className="p-4 text-dark-300">{payment.service_name}</td>
                    <td className="p-4 text-dark-300">
                      {payment.method === 'pix' ? 'Pix' : 'No local'}
                    </td>
                    <td className="p-4 text-primary-500 font-medium">
                      R$ {payment.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(payment.id, 'confirmed')}
                            className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                          >
                            Confirmar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
