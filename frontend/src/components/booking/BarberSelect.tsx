import { Barber } from '../../types'
import { Card } from '../ui/Card'
import { Loading } from '../ui/Loading'
import { User, Users, Star, CheckCircle2 } from 'lucide-react'

interface BarberSelectProps {
  barbers: Barber[]
  loading: boolean
  onSelect: (barber: Barber | null) => void
}

export function BarberSelect({ barbers, loading, onSelect }: BarberSelectProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading text="Buscando especialistas disponíveis..." />
      </div>
    )
  }

  const sortedBarbers = [...barbers].sort((a, b) => (a.display_order || 99) - (b.display_order || 99))

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-6 px-2">
        <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
        <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Escolha o Profissional</span>
      </div>

      {sortedBarbers.map((barber) => (
        <Card
          key={barber.id}
          hoverable
          onClick={() => onSelect(barber)}
          className="group relative overflow-hidden flex items-center justify-between !p-5"
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
               <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center border border-white/[0.05] overflow-hidden group-hover:border-primary-500/50 transition-colors">
                 {/* Placeholder ou Imagem Real */}
                 <User className="w-8 h-8 text-neutral-700 group-hover:text-primary-500 transition-colors" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black border border-white/[0.05] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-500" />
               </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors">
                  {barber.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Disponível Hoje
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 relative z-10">
             <span className="text-[8px] bg-primary-500 text-black px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">
                Mestre
              </span>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
        </Card>
      ))}

      <Card
        hoverable
        onClick={() => onSelect(null)}
        className="group relative overflow-hidden flex items-center justify-between !p-5 border-dashed border-white/10 hover:border-solid"
      >
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center border border-white/[0.03] group-hover:border-primary-500/30 transition-colors">
            <Users className="w-8 h-8 text-neutral-700 group-hover:text-primary-500 transition-colors" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors">
              Qualquer Profissional
            </h3>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
              O primeiro horário livre
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
