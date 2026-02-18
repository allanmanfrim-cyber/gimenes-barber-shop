import { Service } from '../../types'
import { Card } from '../ui/Card'
import { Loading } from '../ui/Loading'
import { Clock, DollarSign } from 'lucide-react'

interface ServiceSelectProps {
  services: Service[]
  loading: boolean
  onSelect: (service: Service) => void
}

export function ServiceSelect({ services, loading, onSelect }: ServiceSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Carregando servicos..." />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Card
          key={service.id}
          hoverable
          onClick={() => onSelect(service)}
          className="cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-4 text-dark-300">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{service.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary-500" />
              <span>R$ {service.price.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      ))}

      {services.length === 0 && !loading && (
        <p className="text-center text-dark-400 py-8">
          Nenhum servico disponivel no momento
        </p>
      )}
    </div>
  )
}
