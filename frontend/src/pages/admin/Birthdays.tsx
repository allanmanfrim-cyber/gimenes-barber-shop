import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Gift, MessageCircle } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'

export default function AdminBirthdays() {
  const [clients, setClients] = useState<any[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  const loadBirthdays = async () => {
    setLoading(true)
    try {
      const response = await api.admin.birthdayClients(date)
      setClients(response.clients)
    } catch (error) {
      console.error('Erro ao carregar aniversariantes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBirthdays()
  }, [date])

  const sendWhatsApp = (client: any) => {
    const message = `Feliz aniversÃ¡rio, ${client.name.split(' ')[0]}! ðŸŽ‰\nQue tal aproveitar seu dia para renovar o visual? ðŸ’ˆ\nAgende aqui: https://www.gimenesbarber.com.br`
    const phone = client.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <AdminLayout title="Aniversariantes">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Gift className="w-6 h-6 text-pink-500" />
              FelicitaÃ§Ãµes do Dia
            </h2>
            <p className="text-dark-400">Clientes que fazem aniversÃ¡rio nesta data</p>
          </div>

          <div className="bg-dark-900 rounded-lg p-1 border border-dark-700">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading text="Buscando aniversariantes..." />
          </div>
        ) : (
          <div className="bg-dark-900 rounded-xl shadow-sm border border-dark-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800/50 text-dark-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Cliente</th>
                    <th className="px-6 py-4 text-left font-semibold">WhatsApp</th>
                    <th className="px-6 py-4 text-left font-semibold">Data de Nascimento</th>
                    <th className="px-6 py-4 text-right font-semibold">AÃ§Ã£o</th>
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
                          {client.data_nascimento ? new Date(client.data_nascimento).toLocaleDateString('pt-BR') : '-'}
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
                        Nenhum aniversariante encontrado para esta data.
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



