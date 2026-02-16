import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { BusinessHours } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const daysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terca-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sabado'
]

export default function AdminSettings() {
  const [hours, setHours] = useState<BusinessHours[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadHours()
  }, [])

  const loadHours = async () => {
    try {
      const response = await fetch('/api/business-hours')
      const data = await response.json()
      setHours(data.hours)
    } catch (error) {
      console.error('Error loading hours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (dayOfWeek: number, field: keyof BusinessHours, value: string | number) => {
    setHours(prev =>
      prev.map(h =>
        h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/business-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ hours })
      })
      alert('Horarios atualizados com sucesso!')
    } catch (error) {
      console.error('Error saving hours:', error)
      alert('Erro ao salvar horarios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Configuracoes">
      <div className="space-y-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Horario de Funcionamento
          </h2>

          {loading ? (
            <p className="text-dark-400">Carregando...</p>
          ) : (
            <div className="space-y-4">
              {hours.map((day) => (
                <div
                  key={day.day_of_week}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-dark-700/50 rounded-lg"
                >
                  <div className="w-32">
                    <span className="text-white font-medium">
                      {daysOfWeek[day.day_of_week]}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!day.is_open}
                        onChange={(e) =>
                          handleChange(day.day_of_week, 'is_open', e.target.checked ? 1 : 0)
                        }
                        className="w-4 h-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500 bg-dark-800"
                      />
                      <span className="text-dark-300 text-sm">Aberto</span>
                    </label>

                    {day.is_open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={day.open_time}
                          onChange={(e) =>
                            handleChange(day.day_of_week, 'open_time', e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-dark-400">ate</span>
                        <Input
                          type="time"
                          value={day.close_time}
                          onChange={(e) =>
                            handleChange(day.day_of_week, 'close_time', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-dark-500">Fechado</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={handleSave} loading={saving}>
                  Salvar Horarios
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
