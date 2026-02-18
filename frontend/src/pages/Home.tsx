import { Link } from 'react-router-dom'
import { Calendar, Star, Clock, MapPin, Phone } from 'lucide-react'

export default function Home() {
  const services = [
    { name: 'Corte de Cabelo', description: 'Corte tradicional com máquina e tesoura', price: 'R$ 40,00' },
    { name: 'Barba', description: 'Aparo e modelagem completa', price: 'R$ 30,00' },
    { name: 'Corte de Cabelo + Barba', description: 'Combo completo', price: 'R$ 60,00' },
    { name: 'Corte + Hidratação', description: 'Corte e tratamento capilar', price: 'R$ 60,00' },
    { name: 'Corte + Barba + Hidratação', description: 'Pacote completo de cuidados', price: 'R$ 75,00' },
    { name: 'Pézinho', description: 'Acabamento e contorno', price: 'R$ 15,00' },
    { name: 'Sobrancelha', description: 'Design e limpeza', price: 'R$ 10,00' },
  ]

  const features = [
    { icon: Calendar, title: 'Rápido', description: 'Agende em 2 minutos' },
    { icon: Star, title: 'Experientes', description: 'Profissionais qualificados' },
    { icon: Clock, title: 'Flexível', description: 'Segunda a sábado' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* 1 - Hero Section: Preto Fosco e sem slogan */}
      <section className="bg-[#0f1115] py-20 px-4 border-b border-white/5">
        <div className="max-w-md mx-auto text-center">
          <img 
            src="/images/logo.png" 
            alt="Gimenes Barber Shop" 
            className="w-80 max-w-[85%] mx-auto mb-12"
          />
          
          <Link 
            to="/agendar" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-dark-900 font-bold py-4 px-12 rounded-lg transition-all duration-200 uppercase tracking-wider text-sm shadow-lg shadow-primary-500/10"
          >
            Agendar Horário
          </Link>
        </div>
      </section>

      {/* 2 - Vantagens: Linha única e minimalista */}
      <section className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center gap-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center px-1">
                <feature.icon className="w-5 h-5 text-dark-900 mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-dark-900 leading-none">{feature.title}</span>
                <span className="text-[9px] text-dark-400 mt-1 leading-tight">{feature.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 - Serviços: Minimalista com preço na frente e selo Indicado */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl uppercase tracking-widest font-bold text-dark-900 text-center mb-10">
            Nossos Serviços
          </h2>
          
          <div className="divide-y divide-gray-100">
            {services.map((service) => (
              <div 
                key={service.name} 
                className="py-6 flex justify-between items-center group"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-dark-900 uppercase tracking-tight">{service.name}</h3>
                    {service.name === 'Corte + Barba' && (
                      <span className="text-[8px] bg-dark-900 text-white px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                        Indicado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dark-400 mt-1">{service.description}</p>
                </div>
                <span className="text-sm font-bold text-primary-600 ml-4 whitespace-nowrap">
                  {service.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-8">
            Pronto para seu novo visual?
          </h2>
          <Link 
            to="/agendar" 
            className="inline-block bg-dark-900 hover:bg-black text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 uppercase tracking-widest text-xs"
          >
            Começar Agendamento
          </Link>
        </div>
      </section>

      {/* 4 - Footer: Minimalista */}
      <footer className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-dark-900">
            <div className="space-y-3">
              <MapPin className="w-4 h-4 mx-auto text-dark-400" />
              <p className="text-[11px] leading-relaxed uppercase tracking-wider">
                R. Ademar de Barros, 278<br />
                José Bonifácio - SP
              </p>
            </div>
            
            <div className="space-y-3">
              <Clock className="w-4 h-4 mx-auto text-dark-400" />
              <p className="text-[11px] leading-relaxed uppercase tracking-wider">
                Seg - Sex: 9h às 20h<br />
                Sábado: 8h às 18h
              </p>
            </div>
            
            <div className="space-y-3">
              <Phone className="w-4 h-4 mx-auto text-dark-400" />
              <p className="text-[11px] leading-relaxed uppercase tracking-wider">
                (17) 99219-5185<br />
                @gimenesbarberjr
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-50 flex justify-center">
            <Link to="/admin" className="text-[9px] uppercase tracking-[0.2em] text-dark-300 hover:text-dark-900 transition-colors">
              Área Administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
