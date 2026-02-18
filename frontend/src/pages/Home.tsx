import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Scissors, Clock, MapPin, Instagram } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mb-6">
          <Scissors className="w-10 h-10 text-dark-900" />
        </div>
        
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Gimenes Barber Shop
        </h1>
        
        <p className="text-dark-400 text-center mb-8">
          Estilo e precisao em cada corte
        </p>

        <Link to="/agendar" className="w-full max-w-xs">
          <Button fullWidth size="lg">
            Agendar Horario
          </Button>
        </Link>

        <div className="mt-12 grid grid-cols-1 gap-4 w-full max-w-xs">
          <div className="flex items-center gap-3 text-dark-300">
            <Clock className="w-5 h-5 text-primary-500" />
            <span>Seg-Sex: 09h - 19h | Sab: 09h - 17h</span>
          </div>
          <div className="flex items-center gap-3 text-dark-300">
            <MapPin className="w-5 h-5 text-primary-500" />
            <span>Rua Principal, 123 - Centro</span>
          </div>
          <div className="flex items-center gap-3 text-dark-300">
            <Instagram className="w-5 h-5 text-primary-500" />
            <span>@gimenesbarber</span>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-dark-500 text-sm border-t border-dark-800">
        <Link to="/admin" className="hover:text-dark-300 transition-colors">
          Area Administrativa
        </Link>
      </footer>
    </div>
  )
}
