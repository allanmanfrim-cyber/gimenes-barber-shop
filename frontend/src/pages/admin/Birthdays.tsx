import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Gift, MessageCircle, Star, Search } from 'lucide-react'
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
    const firstName = client.name.split(' ')[0]
    const message = `Feliz aniversário, ${firstName}! 🎉\nQue tal aproveitar seu dia para renovar o visual? 💈\nAgende aqui: https://www.gimenesbarber.com.br`
    const phone = client.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <AdminLayout title="Aniversariantes">
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                <Gift className="w-7 h-7 text-pink-500" />
             </div>
             <div>
                <span className="text-[10px] text-pink-500 font-black uppercase tracking-[0.4em] leading-none mb-2 block">Celebração de Clientes</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Felicitações do Dia</h2>
             </div>
          </div>

          <div className="bg-neutral-900/50 p-3 rounded-2xl border border-white/[0.05] shadow-inner backdrop-blur-sm">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-white px-4 py-1 text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-neutral-950/50 border border-white/[0.03] rounded-[40px] space-y-4">
             <div className="w-16 h-16 border-4 border-pink-500/10 border-t-pink-500 rounded-full animate-spin" />
             <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.4em]">Buscando aniversariantes...</span>
          </div>
        ) : (
          <div className="bg-neutral-950/50 border border-white/[0.03] rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.03]">
                    <th className="px-8 py-8 text-left">
                       <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-primary-500 fill-primary-500" />
                          <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em]">Cliente</span>
                       </div>
                    </th>
                    <th className="px-8 py-8 text-left">
                       <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em]">WhatsApp</span>
                    </th>
                    <th className="px-8 py-8 text-left">
                       <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em]">Data de Nascimento</span>
                    </th>
                    <th className="px-8 py-8 text-right pr-12">
                       <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em]">Ação</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-8">
                          <span className="text-white font-black uppercase tracking-tight block text-sm group-hover:text-pink-500 transition-colors">{client.name}</span>
                        </td>
                        <td className="px-8 py-8">
                          <span className="text-neutral-400 font-mono text-xs">{client.whatsapp}</span>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-2">
                             <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                                {client.data_nascimento ? new Date(client.data_nascimento).toLocaleDateString('pt-BR') : '-'}
                             </span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-right pr-12">
                          <button
                            onClick={() => sendWhatsApp(client)}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest group/btn"
                          >
                            <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Parabenizar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                           <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-neutral-700" />
                           </div>
                           <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.2em]">Nenhum aniversariante encontrado para esta data.</p>
                        </div>
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
