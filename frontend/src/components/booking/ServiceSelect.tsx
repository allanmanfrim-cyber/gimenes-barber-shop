import { Service } from '../../types'
import { Loading } from '../ui/Loading'
import { Clock } from 'lucide-react'

interface ServiceSelectProps {
  services: Service[]
  selectedServices: Service[]
  loading: boolean
  onToggle: (service: Service) => void
}

export function ServiceSelect({ services, selectedServices, loading, onToggle }: ServiceSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Carregando serviços..." />
      </div>
    )
  }

  const isSelected = (service: Service) => {
    return selectedServices.some(s => s.id === service.id)
  }

  const getServiceDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'Corte de Cabelo': 'Corte tradicional com máquina e tesoura',
      'Barba': 'Aparo e modelagem completa da barba',
      'Corte de Cabelo + Barba': 'Combo completo para um visual impecável',
      'Corte + Hidratação': 'Corte e tratamento capilar hidratante',
      'Corte + Barba + Hidratação': 'Pacote completo de cuidados para cabelo e barba',
      'Pézinho': 'Acabamento e contorno do cabelo',
      'Sobrancelha': 'Design e limpeza da sobrancelha',
    }
    return descriptions[name] || 'Serviço profissional de barbearia'
  }

  const isPopular = (name: string) => {
    return name.toLowerCase().includes('corte + barba') || name.toLowerCase().includes('combo')
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-dark-900 mb-2">Escolha os serviços</h2>
      <p className="text-dark-400 mb-6">Selecione um ou mais serviços que deseja realizar</p>

      <div className="space-y-4">
        {services.map((service) => {
          const selected = isSelected(service)
          const popular = isPopular(service.name)

          return (
            <div
              key={service.id}
              onClick={() => onToggle(service)}
              className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 ${
                selected 
                  ? 'border-green-700 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-dark-900">{service.name}</h3>
                    {popular && (
                      <span className="px-2 py-0.5 bg-primary-500 text-dark-900 text-xs font-semibold rounded">
                        Mais popular
                      </span>
                    )}
                  </div>
                  <p className="text-dark-500 text-sm mb-3">
                    {getServiceDescription(service.name)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-dark-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration_minutes} min</span>
                    </div>
                    <span className="text-lg font-bold text-dark-900">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  selected 
                    ? 'border-green-700 bg-green-700' 
                    : 'border-gray-300'
                }`}>
                  {selected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {services.length === 0 && !loading && (
          <p className="text-center text-dark-400 py-8">
            Nenhum serviço disponível no momento
          </p>
        )}
      </div>
    </div>
  )
}
