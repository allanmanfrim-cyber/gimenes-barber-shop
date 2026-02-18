import { Barber } from '../../types'
import { Card } from '../ui/Card'
import { Loading } from '../ui/Loading'
import { User, Users } from 'lucide-react'

interface BarberSelectProps {
  barbers: Barber[]
  loading: boolean
  onSelect: (barber: Barber | null) => void
}

export function BarberSelect({ barbers, loading, onSelect }: BarberSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Carregando barbeiros..." />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Card
        hoverable
        onClick={() => onSelect(null)}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Qualquer Barbeiro
            </h3>
            <p className="text-sm text-dark-400">
              Primeiro disponivel no horario
            </p>
          </div>
        </div>
      </Card>

      {barbers.map((barber) => (
        <Card
          key={barber.id}
          hoverable
          onClick={() => onSelect(barber)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {barber.name}
              </h3>
              <p className="text-sm text-green-500">
                Disponivel
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
