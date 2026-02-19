import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PaymentStatus, PaymentMethod, PaymentWithDetails } from '../../types'
import { QrCode, CreditCard, Wallet, CheckCircle, XCircle } from 'lucide-react'

interface PaymentWithDetails {
  id: number
  appointment_id: number
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  external_reference?: string
  paid_at?: string
  date_time: string
  client_name: string
  service_name: string
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all')

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const data = await api.payments.list()
      setPayments(data.payments as PaymentWithDetails[])
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async (payment: PaymentWithDetails) => {
    try {
      const status = payment.method === 'pix' ? 'approved' : 'approved'
      await api.payments.update(payment.id, { status } as any)
      loadPayments()
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const handleMarkPaidOnSite = async (payment: PaymentWithDetails) => {
    try {
      await api.payments.update(payment.id, { status: 'approved', paid_at: new Date().toISOString() } as any)
      loadPayments()
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const handleCancelPayment = async (payment: PaymentWithDetails) => {
    try {
      await api.payments.update(payment.id, { status: 'cancelado' } as any)
      loadPayments()
    } catch (error) {
      console.error('Error cancelling payment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'approved': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'cancelado': return 'bg-red-500/20 text-red-400'
      default: return 'bg-dark-600 text-dark-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Pago via Pix'
      case 'approved': return 'Pago via Cartao'
      case 'paid_nubank': return 'Pago via Nubank'
      case 'pending': return 'Pagar no local'
      case 'pending': return 'Aguardando'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'pix': return <QrCode className="w-4 h-4 text-[#32BCAD]" />
      case 'nubank': return <span className="text-[#820AD1] font-black text-xs">Nu</span>
      case 'credit_card': return <CreditCard className="w-4 h-4 text-blue-400" />
      case 'machine': return <CreditCard className="w-4 h-4 text-dark-400" />
      case 'cash': return <Wallet className="w-4 h-4 text-green-400" />
      case 'cash': return <Wallet className="w-4 h-4 text-dark-400" />
      default: return null
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'pix': return 'Pix'
      case 'nubank': return 'Nubank'
      case 'credit_card': return 'Cartao'
      case 'machine': return 'Maquina'
      case 'cash': return 'Dinheiro'
      case 'cash': return 'No local'
      default: return method
    }
  }

  const filteredPayments = payments.filter(p => 
    filter === 'all' || p.status === filter
  )

  const statusFilters: { label: string; value: 'all' | PaymentStatus }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Pago Pix', value: 'approved' },
    { label: 'Pago Cartao', value: 'approved' },
    { label: 'No Local', value: 'pending' },
    { label: 'Aguardando', value: 'pending' },
    { label: 'Cancelado', value: 'cancelado' }
  ]

  return (
    <AdminLayout title="Pagamentos">
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary-500 text-dark-900'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-dark-400 p-6">Carregando...</p>
          ) : filteredPayments.length === 0 ? (
            <p className="text-dark-400 p-6">Nenhum pagamento encontrado</p>
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
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="p-4 text-dark-300">
                        {payment.date_time && format(new Date(payment.date_time), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="p-4 text-white">{payment.client_name}</td>
                      <td className="p-4 text-dark-300">{payment.service_name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.method)}
                          <span className="text-dark-300">{getMethodLabel(payment.method)}</span>
                        </div>
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
                        <div className="flex justify-end gap-2">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleConfirmPayment(payment)}
                              className="flex items-center gap-1 text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Confirmar
                            </button>
                          )}
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleMarkPaidOnSite(payment)}
                              className="flex items-center gap-1 text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                            >
                              <Wallet className="w-3 h-3" />
                              Recebido
                            </button>
                          )}
                          {(payment.status === 'pending' || payment.status === 'pending') && (
                            <button
                              onClick={() => handleCancelPayment(payment)}
                              className="flex items-center gap-1 text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}










