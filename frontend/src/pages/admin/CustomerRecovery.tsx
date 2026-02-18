import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { MessageCircle } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'

export default function AdminCustomerRecovery() {
  const [clients, setClients] = useState<any[]>([])
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  const loadClients = async () => {
    setLoading(true)
    try {
      const response = await api.admin.inactiveClients(days)
      setClients(response.clients)
    } catch (error) {
      console.error('Erro ao carregar clientes inativos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [days])

  const sendWhatsApp = (client: any) => {
    const message = `Oi ${client.name.split(' ')[0]}, sentimos sua falta! 💈\nQue tal agendar um horário para renovar o visual? ✂️\nhttps://www.gimenesbarber.com.br`
    const phone = client.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <AdminLayout title="Recuperador de Clientes">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Clientes Inativos</h2>
            <p className="text-dark-400">Listagem de clientes que não agendam há algum tempo</p>
          </div>

          <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-700">
            {[30, 45, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  days === d 
                    ? 'bg-primary-500 text-dark-900 shadow-sm' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {d} dias
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading text="Buscando clientes..." />
          </div>
        ) : (
          <div className="bg-dark-900 rounded-xl shadow-sm border border-dark-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800/50 text-dark-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Cliente</th>
                    <th className="px-6 py-4 text-left font-semibold">WhatsApp</th>
                    <th className="px-6 py-4 text-left font-semibold">Último Agendamento</th>
                    <th className="px-6 py-4 text-right font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-dark-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-medium">{client.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-dark-400">
                          {client.whatsapp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-dark-400">
                          {new Date(client.last_appointment).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => sendWhatsApp(client)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-dark-900 rounded-lg transition-all text-sm font-bold"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-dark-500">
                        Nenhum cliente encontrado para este período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
