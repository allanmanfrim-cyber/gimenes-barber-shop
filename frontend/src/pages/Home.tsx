import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Scissors, Clock, MapPin, Instagram, Phone } from 'lucide-react'
import { api } from '../services/api'
import { Service } from '../types'

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.services.list()
        setServices(data.services)
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-[#121212]">
        <div className="w-24 h-24 bg-primary-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/20">
          <Scissors className="w-12 h-12 text-dark-900" />
        </div>
        
        <h1 className="text-5xl font-bold text-white text-center mb-4 tracking-tight">
          Gimenes Barber Shop
        </h1>
        
        <p className="text-dark-400 text-center mb-10 text-lg max-w-xs">
          Estilo e precisão em cada corte. Onde a tradição encontra o moderno.
        </p>

        <Link to="/agendar" className="w-full max-w-sm">
          <Button fullWidth size="lg" className="py-6 text-lg rounded-2xl shadow-xl shadow-primary-500/10">
            Agendar Horário
          </Button>
        </Link>
      </div>

      {/* Vantagens Minimalistas */}
      <section className="py-12 border-y border-dark-800 bg-dark-950">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3 text-dark-300">
            <Clock className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium uppercase tracking-widest">Agilidade</span>
          </div>
          <div className="flex items-center gap-3 text-dark-300">
            <Scissors className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium uppercase tracking-widest">Qualidade</span>
          </div>
          <div className="flex items-center gap-3 text-dark-300">
            <Instagram className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium uppercase tracking-widest">Estilo</span>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="bg-dark-900 py-20 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-primary-500 text-center mb-12">
            Nossos Serviços
          </h2>
          
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="group flex justify-between items-center p-4 rounded-2xl hover:bg-dark-800 transition-colors border border-transparent hover:border-dark-700"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{service.name}</h3>
                      {(service.name.toLowerCase().includes('combo') || service.name === 'Corte + Barba') && (
                        <span className="text-[10px] bg-primary-500 text-dark-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Indicado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-400 mt-1">{service.duration_minutes} minutos</p>
                  </div>
                  <span className="text-base font-bold text-primary-500 ml-4">
                    R$ {Number(service.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-dark-500 text-center py-10 italic">Nenhum serviço disponível no momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="bg-dark-950 py-16 px-4 border-t border-dark-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-dark-300">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-dark-900 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-xs leading-relaxed uppercase tracking-widest">
                R. Ademar de Barros, 278<br />
                Centro - José Bonifácio/SP
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-dark-900 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-xs leading-relaxed uppercase tracking-widest">
                Seg - Sex: 9h às 20h<br />
                Sábado: 8h às 18h
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-dark-900 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-xs leading-relaxed uppercase tracking-widest">
                (17) 99219-5185<br />
                @gimenesbarberjr
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-dark-800 flex flex-col items-center space-y-4">
            <Link to="/admin" className="text-[10px] uppercase tracking-[0.3em] text-dark-500 hover:text-primary-500 transition-colors">
              Área Administrativa
            </Link>
            <p className="text-[10px] text-dark-600 uppercase tracking-[0.2em] font-medium">
              Direitos autorais Agência FritaKuka
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
