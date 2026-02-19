import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Appointment, Barber } from '../../types'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    loadBarbers()
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [selectedDate, selectedBarberId])

  const loadBarbers = async () => {
    try {
      const { barbers } = await api.barbers.list()
      setBarbers(barbers)
    } catch (error) {
      console.error('Error loading barbers:', error)
    }
  }

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const { appointments } = await api.appointments.list(dateStr, selectedBarberId || undefined)
      setAppointments(appointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: Appointment['status']) => {
    try {
      await api.appointments.update(id, { status })
      loadAppointments()
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return
    try {
      await api.appointments.cancel(id)
      loadAppointments()
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    }
  }

  const handleNoShow = async (id: number, clientId: number) => {
    if (!confirm('Registrar falta para este cliente? Isso aumentarÃ¡ o contador de faltas e aplicarÃ¡ a regra de multa.')) return
    try {
      await api.admin.registerNoShow(clientId)
      await handleStatusChange(id, 'cancelado')
      alert('Falta registrada e agendamento cancelado.')
    } catch (error) {
      console.error('Error registering no-show:', error)
    }
  }

  const handleClearPenalty = async (clientId: number) => {
    if (!confirm('Deseja realmente limpar a multa deste cliente?')) return
    try {
      await api.admin.clearPenalty(clientId)
      loadAppointments()
      alert('Multa limpa com sucesso.')
    } catch (error) {
      console.error('Error clearing penalty:', error)
    }
  }

  return (
    <AdminLayout title="Agendamentos">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="p-2 hover:bg-dark-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-dark-300" />
            </button>
            <span className="text-white font-medium min-w-[200px] text-center">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-2 hover:bg-dark-700 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-dark-300" />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedBarberId === null ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedBarberId(null)}
            >
              Todos
            </Button>
            {barbers.map((barber) => (
              <Button
                key={barber.id}
                variant={selectedBarberId === barber.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedBarberId(barber.id)}
              >
                {barber.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-dark-400 p-6">Carregando...</p>
          ) : appointments.length === 0 ? (
            <p className="text-dark-400 p-6">Nenhum agendamento nesta data</p>
          ) : (
            <div className="divide-y divide-dark-700">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 hover:bg-dark-700/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-primary-500 font-semibold text-lg">
                        {format(new Date(appointment.date_time), 'HH:mm')}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {appointment.client?.name}
                        </p>
                        <p className="text-dark-400 text-sm">
                          {appointment.service?.name} ({appointment.service?.duration_minutes}min)
                        </p>
                        <p className="text-dark-500 text-sm">
                          {appointment.barber?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmado' ? 'bg-blue-500/20 text-blue-400' :
                        appointment.status === 'concluido' ? 'bg-green-500/20 text-green-400' :
                        appointment.status === 'cancelado' ? 'bg-red-500/20 text-red-400' :
                        'bg-dark-600 text-dark-300'
                      }`}>
                        {appointment.status === 'confirmado' ? 'Confirmado' :
                         appointment.status === 'concluido' ? 'Finalizado' :
                         appointment.status === 'cancelado' ? 'Cancelado' :
                         appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Detalhes do Agendamento"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-400">Cliente</span>
                <span className="text-white">{selectedAppointment.client?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">WhatsApp</span>
                <span className="text-white">{selectedAppointment.client?.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Servico</span>
                <span className="text-white">{selectedAppointment.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Barbeiro</span>
                <span className="text-white">{selectedAppointment.barber?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Horario</span>
                <span className="text-white">
                  {format(new Date(selectedAppointment.date_time), "dd/MM/yyyy 'as' HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Valor</span>
                <span className="text-primary-500 font-semibold">
                  R$ {selectedAppointment.service?.price.toFixed(2)}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="flex justify-between">
                  <span className="text-dark-400">Observacoes</span>
                  <span className="text-white">{selectedAppointment.notes}</span>
                </div>
              )}
              {selectedAppointment.client?.status_multa === 'ativa' && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-red-400 text-xs font-bold uppercase">Multa Ativa</p>
                    <p className="text-white text-xs">Agendamentos bloqueados.</p>
                  </div>
                  <button
                    onClick={() => handleClearPenalty(selectedAppointment.client_id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                  >
                    LIMPAR
                  </button>
                </div>
              )}
            </div>

            {selectedAppointment.status !== 'cancelado' && (
              <div className="flex gap-2 pt-4 border-t border-dark-700">
                {selectedAppointment.status === 'confirmado' && (
                  <Button
                    fullWidth
                    onClick={() => handleStatusChange(selectedAppointment.id, 'concluido')}
                  >
                    <Check className="w-4 h-4" />
                    Finalizar
                  </Button>
                )}
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => handleNoShow(selectedAppointment.id, selectedAppointment.client_id)}
                >
                  <X className="w-4 h-4" />
                  Registrar Falta
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleCancel(selectedAppointment.id)}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}








