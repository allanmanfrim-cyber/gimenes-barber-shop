import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Scissors, Clock, MapPin, Instagram, Phone, Star, ShieldCheck, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import { Service, Barber } from '../types'

export default function Home() {
  const { config } = useTheme();
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, barbersData] = await Promise.all([
          api.services.list(),
          api.barbers.list()
        ])
        setServices(servicesData.services)
        setBarbers(barbersData.barbers)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dark-800 rounded-xl overflow-hidden p-1 border border-white/10">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg">{config.nome_barbearia}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="text-sm text-dark-400 hover:text-primary-500 transition-colors uppercase tracking-widest font-medium">ServiÃ§os</a>
            <a href="#barbeiros" className="text-sm text-dark-400 hover:text-primary-500 transition-colors uppercase tracking-widest font-medium">Barbeiros</a>
            <a href="#unidades" className="text-sm text-dark-400 hover:text-primary-500 transition-colors uppercase tracking-widest font-medium">Unidades</a>
          </nav>

          <Link to="/agendar">
            <Button size="sm" className="hidden md:flex rounded-full px-6">Agendar Agora</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="w-32 h-32 bg-primary-500 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary-500/20 transform rotate-3">
          <Scissors className="w-14 h-14 text-dark-900 -rotate-3" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white text-center mb-6 tracking-tighter leading-[0.9]">
          ESTILO &<br />
          <span className="text-primary-500">PRECISÃƒO.</span>
        </h1>
        
        <p className="text-dark-400 text-center mb-12 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
          Onde a tradiÃ§Ã£o da barbearia clÃ¡ssica encontra o acabamento moderno de alto nÃ­vel.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-sm md:max-w-none justify-center">
          <Link to="/agendar" className="w-full md:w-auto">
            <Button fullWidth size="lg" className="h-16 px-12 text-lg rounded-full shadow-2xl shadow-primary-500/20 group">
              Agendar HorÃ¡rio
              <Star className="w-5 h-5 ml-2 fill-dark-900 group-hover:scale-125 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Vantagens Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-dark-800/50 border border-white/5 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Qualidade Premium</h3>
              <p className="text-dark-400 text-sm leading-relaxed">Equipamentos de Ãºltima geraÃ§Ã£o e produtos de marcas renomadas mundialmente.</p>
            </div>
            
            <div className="p-8 bg-dark-800/50 border border-white/5 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Ambiente Exclusivo</h3>
              <p className="text-dark-400 text-sm leading-relaxed">Conforto absoluto com ar-condicionado, cafÃ© gourmet e trilha sonora selecionada.</p>
            </div>

            <div className="p-8 bg-dark-800/50 border border-white/5 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">HorÃ¡rio Pontual</h3>
              <p className="text-dark-400 text-sm leading-relaxed">Respeito total ao seu tempo com sistema de agendamento preciso e sem atrasos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ServiÃ§os Section */}
      <section id="servicos" className="bg-dark-950 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-primary-500 mb-4">
              Nossos ServiÃ§os
            </h2>
            <p className="text-4xl font-bold text-white tracking-tight">O que fazemos de melhor.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="group flex justify-between items-center p-6 bg-dark-900 border border-white/5 rounded-3xl hover:border-primary-500/30 transition-all"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      {service.name.toLowerCase().includes('combo') && (
                        <span className="text-[10px] bg-primary-500 text-dark-900 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-dark-400 mt-1 text-sm">{service.duration_minutes} min â€¢ Corte com tesoura e mÃ¡quina</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary-500">
                      R$ {Number(service.price).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Barbeiros Section */}
      <section id="barbeiros" className="bg-dark-900/50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-primary-500 mb-4">
              Profissionais
            </h2>
            <p className="text-4xl font-bold text-white tracking-tight">Especialistas em Estilo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {barbers.map((barber) => (
              <div key={barber.id} className="group relative">
                <div className="aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 bg-dark-800">
                  <img 
                    src={barber.name.toLowerCase().includes('junior') ? '/images/junior.png' : '/images/abner.jpg'} 
                    alt={barber.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-2">Barbeiro Especialista</p>
                    <h3 className="text-white text-3xl font-bold mb-4">{barber.name}</h3>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contato */}
      <footer id="unidades" className="bg-dark-950 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dark-800 rounded-xl overflow-hidden p-1 border border-white/10">
                  <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-bold tracking-tight text-xl">{config.nome_barbearia}</span>
              </div>
              <p className="text-dark-400 leading-relaxed text-sm">
                A melhor experiÃªncia em barbearia da regiÃ£o de JosÃ© BonifÃ¡cio. TradiÃ§Ã£o, estilo e o melhor atendimento para vocÃª.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">Contatos</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 transition-colors">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    {config.endereco}<br />
                    <span className="text-white font-medium">Centro - JosÃ© BonifÃ¡cio/SP</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 transition-colors">
                    <Phone className="w-5 h-5 text-primary-500" />
                  </div>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    {config.whatsapp}<br />
                    <span className="text-white font-medium">WhatsApp Oficial</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-bold text-lg uppercase tracking-widest">HorÃ¡rios</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 transition-colors">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="text-sm">
                    <p className="text-dark-300 leading-none mb-2 font-medium">Segunda Ã  Sexta</p>
                    <p className="text-white font-bold text-lg">09h Ã s 20h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-dark-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500 transition-colors">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="text-sm">
                    <p className="text-dark-300 leading-none mb-2 font-medium">SÃ¡bado</p>
                    <p className="text-white font-bold text-lg">08h Ã s 18h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-dark-500 uppercase tracking-[0.3em] font-bold">
              Â© 2026 {config.nome_barbearia} â€¢ Todos os direitos reservados
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-dark-500 uppercase tracking-[0.3em] font-bold">Desenvolvido por</p>
              <span className="text-[10px] text-primary-500 font-black tracking-widest uppercase">AgÃªncia FritaKuka</span>
            </div>
            <Link to="/admin" className="text-[10px] text-dark-500 hover:text-primary-500 transition-colors uppercase tracking-[0.3em] font-bold">
              Ãrea do Profissional
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

