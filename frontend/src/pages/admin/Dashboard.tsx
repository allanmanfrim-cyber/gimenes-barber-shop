import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Appointment } from '../../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Users, DollarSign, Clock } from 'lucide-react'

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="Agendamentos Hoje"
            value={todayAppointments.length.toString()}
            color="primary"
          />
          <StatCard
            icon={Clock}
            label="Confirmados"
            value={confirmedCount.toString()}
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Finalizados"
            value={completedCount.toString()}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            label="Receita do Dia"
            value={`R$ ${totalRevenue.toFixed(2)}`}
            color="amber"
          />
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Agenda de Hoje - {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          </h2>

          {loading ? (
            <p className="text-dark-400">Carregando...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-dark-400">Nenhum agendamento para hoje</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-primary-500 font-semibold">
                      {format(new Date(appointment.date_time), 'HH:mm')}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {appointment.client?.name}
                      </p>
                      <p className="text-dark-400 text-sm">
                        {appointment.service?.name} - {appointment.barber?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                      appointment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-dark-600 text-dark-300'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Confirmado' :
                       appointment.status === 'completed' ? 'Finalizado' :
                       appointment.status}
                    </span>
                    <span className="text-primary-500 font-medium">
                      R$ {appointment.service?.price.toFixed(2)}
                    </span>
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
  color
}: {
  icon: React.ElementType
  label: string
  value: string
  color: 'primary' | 'blue' | 'green' | 'amber'
}) {
  const colors = {
    primary: 'bg-primary-500/10 text-primary-500',
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    amber: 'bg-amber-500/10 text-amber-500'
  }

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-dark-400 text-sm">{label}</p>
          <p className="text-white text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}
