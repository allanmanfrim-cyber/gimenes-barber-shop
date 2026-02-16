import { Barber } from '../../types'
import { Loading } from '../ui/Loading'
import { Phone } from 'lucide-react'

interface BarberSelectProps {
  barbers: Barber[]
  selectedBarber: Barber | null
  loading: boolean
  onSelect: (barber: Barber) => void
}

const barberImages: Record<string, string> = {
  'Junior Gimenes': '/images/junior.png',
  'Abner William': '/images/abner.jpg',
}

const barberInfo: Record<string, { specialty: string; isOwner?: boolean }> = {
  'Junior Gimenes': { specialty: '', isOwner: false },
  'Abner William': { specialty: '' },
}

export function BarberSelect({ barbers, selectedBarber, loading, onSelect }: BarberSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Carregando barbeiros..." />
      </div>
    )
  }

  const sortedBarbers = [...barbers].sort((a, b) => {
    if (a.name === 'Junior Gimenes') return -1
    if (b.name === 'Junior Gimenes') return 1
    return 0
  })

  const getBarberImage = (name: string) => barberImages[name] || null
  const getBarberInfo = (name: string) => barberInfo[name] || { specialty: 'Barbeiro profissional' }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-dark-900 mb-2">Escolha seu barbeiro</h2>
      <p className="text-dark-400 mb-6">Selecione o profissional que irá atendê-lo</p>

      <div className="space-y-4">
        {sortedBarbers.map((barber) => {
          const info = getBarberInfo(barber.name)
          const image = getBarberImage(barber.name)
          const isSelected = selectedBarber?.id === barber.id

          return (
            <div
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={`bg-white rounded-xl p-4 cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'border-green-700 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                  {image ? (
                    <img 
                      src={image} 
                      alt={barber.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-900 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {barber.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-dark-900">{barber.name}</h3>
                  </div>
                  {barber.phone && (
                    <div className="flex items-center gap-1 mt-1 text-green-700 font-medium text-sm">
                      <Phone className="w-3 h-3" />
                      <span>{barber.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
