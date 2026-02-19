import { Service } from '../../types'
import { Card } from '../ui/Card'
import { Loading } from '../ui/Loading'
import { Clock, Star } from 'lucide-react'

interface ServiceSelectProps {
  services: Service[]
  loading: boolean
  onSelect: (service: Service) => void
}

export function ServiceSelect({ services, loading, onSelect }: ServiceSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading text="Carregando catálogo de serviços..." />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-6 px-2">
        <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
        <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Serviços Disponíveis</span>
      </div>

      {services.map((service) => (
        <Card
          key={service.id}
          hoverable
          onClick={() => onSelect(service)}
          className="group relative overflow-hidden flex items-center justify-between !p-6"
        >
          <div className="flex flex-col gap-1 relative z-10">
             <div className="flex items-center gap-3">
               <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors">
                {service.name}
              </h3>
              {service.name.toLowerCase().includes('combo') && (
                <span className="text-[8px] bg-primary-500 text-black px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter">
                  Pro
                </span>
              )}
             </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-neutral-500 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-primary-500/60" />
                <span>{service.duration_minutes} min</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 relative z-10">
             <span className="text-[9px] bg-primary-500/10 text-primary-500 px-2 py-1 rounded-sm font-black uppercase tracking-widest border border-primary-500/20">
                Disponível
              </span>
              <p className="text-xl font-black text-white group-hover:text-primary-500 transition-colors">
                R$ {service.price.toFixed(2).replace('.', ',')}
              </p>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
        </Card>
      ))}

      {services.length === 0 && !loading && (
        <div className="text-center py-20 bg-neutral-900/20 border border-white/[0.03] rounded-2xl">
           <p className="text-neutral-500 text-sm font-black uppercase tracking-[0.2em]">
            Nenhum serviço disponível no momento
          </p>
        </div>
      )}
    </div>
  )
}




