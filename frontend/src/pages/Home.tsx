import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Scissors, Clock, MapPin, Instagram, Phone, Star, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react'
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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-primary-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-neutral-900 rounded-xl overflow-hidden p-1.5 border border-white/[0.05]">
              <img src={config.logotipo_url || "/images/logo.png"} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-white font-bold tracking-tight text-lg uppercase">{config.nome_barbearia}</span>
              <span className="text-[10px] text-primary-500 font-bold tracking-[0.2em] uppercase">Premium Barber</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#servicos" className="text-xs text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em] font-bold">Serviços</a>
            <a href="#barbeiros" className="text-xs text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em] font-bold">Profissionais</a>
            <a href="#unidades" className="text-xs text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-[0.2em] font-bold">Contato</a>
          </nav>

          <Link to="/agendar">
            <Button size="sm" className="hidden md:flex rounded-full px-8 bg-primary-500 text-black border-none hover:scale-105 uppercase tracking-widest text-[11px] font-black">
              Agendar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent -z-10" />
        
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          <span className="text-[10px] text-primary-500 font-bold uppercase tracking-[0.3em]">A melhor experiência da região</span>
        </div>

        <h1 className="text-6xl md:text-[10rem] font-black text-white text-center mb-8 tracking-tighter leading-[0.85] uppercase">
          ESTILO &<br />
          <span className="text-primary-500">PRECISÃO.</span>
        </h1>
        
        <p className="text-neutral-500 text-center mb-12 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
          Tradição clássica com acabamento moderno de alto nível. <br className="hidden md:block" />
          Onde cada detalhe importa.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-sm md:max-w-none justify-center">
          <Link to="/agendar" className="w-full md:w-auto">
            <Button fullWidth size="lg" className="h-16 px-14 text-sm rounded-full bg-primary-500 text-black border-none shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:scale-105 transition-all uppercase font-black tracking-[0.2em]">
              Agendar Horário
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
           <div className="w-[1px] h-12 bg-gradient-to-b from-primary-500 to-transparent" />
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-24 border-y border-white/[0.03] bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Qualidade Premium", desc: "Equipamentos de elite e produtos de marcas renomadas." },
              { icon: Star, title: "Ambiente Exclusivo", desc: "Conforto absoluto, café gourmet e trilha sonora selecionada." },
              { icon: Clock, title: "Horário Pontual", desc: "Respeito total ao seu tempo com sistema preciso e sem atrasos." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-neutral-900 border border-white/[0.05] rounded-2xl flex items-center justify-center mb-6 group-hover:border-primary-500/30 transition-colors">
                  <item.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-[250px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-primary-500 mb-6">Nossos Serviços</h2>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">O que fazemos de melhor</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="group flex justify-between items-center p-8 bg-neutral-900/30 border border-white/[0.03] rounded-2xl hover:border-primary-500/20 transition-all cursor-default"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-1">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-primary-500 transition-colors">{service.name}</h3>
                      {service.name.toLowerCase().includes('combo') && (
                        <span className="text-[9px] bg-primary-500 text-black px-2.5 py-1 rounded-sm font-black uppercase tracking-widest">Destaque</span>
                      )}
                    </div>
                    <p className="text-neutral-500 text-sm font-medium">{service.duration_minutes} min • Experiência Completa</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="text-2xl font-black text-white group-hover:text-primary-500 transition-colors">
                      R$ {Number(service.price).toFixed(2).replace('.', ',')}
                    </p>
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                      <ChevronRight className="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Barbeiros */}
      <section id="barbeiros" className="bg-neutral-900/20 py-32 px-6 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-primary-500 mb-6">Profissionais</h2>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">Mestres das Tesouras</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbers.map((barber) => (
              <div key={barber.id} className="group relative overflow-hidden rounded-3xl border border-white/[0.03] bg-neutral-900/50 aspect-[4/5]">
                <img 
                  src={barber.name.toLowerCase().includes('junior') ? '/images/junior.png' : '/images/abner.jpg'} 
                  alt={barber.name} 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    <p className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px]">Especialista</p>
                  </div>
                  <h3 className="text-white text-3xl font-black mb-6 uppercase">{barber.name}</h3>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-black transition-all cursor-pointer border border-white/5">
                      <Instagram className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="unidades" className="bg-black py-32 px-6 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-32">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-xl overflow-hidden p-2 border border-white/[0.05]">
                  <img src={config.logotipo_url || "/images/logo.png"} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-black tracking-tight text-xl uppercase">{config.nome_barbearia}</span>
              </div>
              <p className="text-neutral-500 leading-relaxed text-sm font-medium">
                Excelência em barbearia. Tradição e modernidade unidas para oferecer o melhor visual e a melhor experiência de cuidado masculino.
              </p>
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 hover:border-primary-500 transition-colors cursor-pointer group">
                    <Instagram className="w-5 h-5 text-neutral-500 group-hover:text-primary-500" />
                 </div>
                 <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 hover:border-primary-500 transition-colors cursor-pointer group">
                    <Phone className="w-5 h-5 text-neutral-500 group-hover:text-primary-500" />
                 </div>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Onde Estamos</h4>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    {config.endereco}<br />
                    <span className="text-white">Centro - José Bonifácio/SP</span>
                  </p>
                </div>
                <div className="flex gap-5">
                  <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                    {config.whatsapp}<br />
                    <span className="text-white underline decoration-primary-500/30">Agende por Mensagem</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Horários</h4>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <Clock className="w-5 h-5 text-primary-500 shrink-0" />
                  <div className="text-sm">
                    <p className="text-neutral-500 mb-1 font-bold uppercase tracking-wider text-[10px]">Segunda à Sexta</p>
                    <p className="text-white font-black text-xl">09h às 20h</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <Clock className="w-5 h-5 text-primary-500 shrink-0" />
                  <div className="text-sm">
                    <p className="text-neutral-500 mb-1 font-bold uppercase tracking-wider text-[10px]">Sábado</p>
                    <p className="text-white font-black text-xl">08h às 18h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-[9px] text-neutral-600 uppercase tracking-[0.4em] font-black">
                © 2026 {config.nome_barbearia} • Todos os direitos reservados
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-[9px] text-neutral-600 uppercase tracking-[0.4em] font-black">Desenvolvido por</p>
              <div className="px-4 py-2 bg-neutral-900/50 border border-white/[0.05] rounded-lg">
                <span className="text-[10px] text-primary-500 font-black tracking-[0.2em] uppercase">Agência FritaKuka</span>
              </div>
            </div>

            <Link to="/admin" className="text-[9px] text-neutral-600 hover:text-primary-500 transition-colors uppercase tracking-[0.4em] font-black">
              Área Administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
