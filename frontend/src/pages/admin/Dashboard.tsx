import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Appointment } from '../../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Users, DollarSign, Clock, TrendingUp, Scissors, ChevronRight, Star } from 'lucide-react'

export default function AdminDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { appointments } = await api.appointments.list(today)
      setTodayAppointments(appointments.filter(a => a.status !== 'cancelled'))
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = todayAppointments.reduce((sum, a) => sum + (a.service?.price || 0), 0)
  const confirmedCount = todayAppointments.filter(a => a.status === 'confirmed').length
  const completedCount = todayAppointments.filter(a => a.status === 'completed').length

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            label="Agendamentos"
            value={todayAppointments.length.toString()}
            subtitle="Hoje"
            color="gold"
          />
          <StatCard
            icon={Clock}
            label="Confirmados"
            value={confirmedCount.toString()}
            subtitle="Prontos"
            color="neutral"
          />
          <StatCard
            icon={Scissors}
            label="Finalizados"
            value={completedCount.toString()}
            subtitle="Cortes realizados"
            color="neutral"
          />
          <StatCard
            icon={TrendingUp}
            label="Faturamento"
            value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
            subtitle="Previsão do dia"
            color="gold"
          />
        </div>

        <div className="bg-neutral-900/30 border border-white/[0.03] rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
             <Calendar className="w-40 h-40 text-white" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <Star className="w-5 h-5 text-primary-500" />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Agenda do Dia
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
               </div>
            </div>
            <button 
              onClick={loadData}
              className="px-4 py-2 bg-neutral-900 border border-white/[0.05] rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:border-primary-500 transition-all"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sincronizando Agenda...</p>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/5">
               <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Nenhum agendamento para hoje</p>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="group flex items-center justify-between p-6 bg-black/40 border border-white/[0.03] rounded-2xl hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-20 h-20 bg-neutral-900 border border-white/[0.05] rounded-xl group-hover:border-primary-500/30 transition-colors">
                      <span className="text-2xl font-black text-primary-500">
                        {format(new Date(appointment.date_time), 'HH:mm')}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors">
                        {appointment.client?.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{appointment.service?.name}</span>
                        <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                        <span className="text-[10px] font-bold text-primary-500/60 uppercase tracking-widest">{appointment.barber?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                       <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest mb-2 ${
                        appointment.status === 'confirmed' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' :
                        appointment.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        'bg-neutral-900 text-neutral-500 border border-white/[0.05]'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                         appointment.status === 'completed' ? 'Finalizado' :
                         appointment.status}
                      </span>
                      <span className="text-xl font-black text-white tracking-tighter">
                        R$ {appointment.service?.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 cursor-pointer border border-white/5">
                       <ChevronRight className="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color
}: {
  icon: React.ElementType
  label: string
  value: string
  subtitle: string
  color: 'gold' | 'neutral'
}) {
  return (
    <div className="bg-neutral-900/40 border border-white/[0.03] rounded-3xl p-6 relative overflow-hidden group hover:border-primary-500/20 transition-all">
      <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform">
         <Icon className="w-24 h-24 text-white" />
      </div>
      
      <div className="flex flex-col relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-colors ${
          color === 'gold' ? 'bg-primary-500 text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-neutral-900 text-neutral-500 border border-white/[0.05]'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{value}</p>
        <div className="flex items-center gap-1.5">
           <div className={`w-1.5 h-1.5 rounded-full ${color === 'gold' ? 'bg-primary-500' : 'bg-neutral-700'}`} />
           <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
