import { useNavigate } from 'react-router-dom'
import { Shield, Sparkles, Clock, Instagram, Phone, Calendar } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="text-center px-6 pt-16 pb-12 border-b border-white/10">

        <img
          src="/images/logo.png"
          alt="Gimenes Barber Shop"
          className="w-64 mx-auto mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">

          <div>
            <Shield className="mx-auto text-primary-500 mb-3" />
            <h3 className="font-semibold">Qualidade Premium</h3>
            <p className="text-neutral-500 text-sm">
              Equipamentos de última geração
            </p>
          </div>

          <div>
            <Sparkles className="mx-auto text-primary-500 mb-3" />
            <h3 className="font-semibold">Ambiente Exclusivo</h3>
            <p className="text-neutral-500 text-sm">
              Conforto absoluto
            </p>
          </div>

          <div>
            <Clock className="mx-auto text-primary-500 mb-3" />
            <h3 className="font-semibold">Horário Pontual</h3>
            <p className="text-neutral-500 text-sm">
              Respeito ao seu tempo
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate('/agendar')}
          className="bg-primary-500 text-black px-10 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
        >
          <Calendar size={18} />
          Agendar Agora
        </button>

      </section>


      {/* PROFISSIONAIS */}
      <section className="px-6 py-16 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-2">
          Nossos Profissionais
        </h2>

        <p className="text-center text-neutral-500 mb-12">
          Escolha o seu barbeiro preferido.
        </p>

        <div className="space-y-8">

          {/* JUNIOR */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">

            <img
              src="/images/junior.png"
              alt="Júnior Gimenes"
              className="w-56 rounded-2xl object-cover"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold">Júnior Gimenes</h3>
              <span className="inline-block bg-primary-500 text-black px-4 py-1 rounded-full text-sm font-bold my-3">
                DISPONÍVEL
              </span>
              <p className="text-neutral-400 mb-4">
                Barbeiro Especialista
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://instagram.com" target="_blank">
                  <Instagram className="text-primary-500" />
                </a>
                <a href="https://wa.me/5517992195185" target="_blank">
                  <Phone className="text-primary-500" />
                </a>
              </div>
            </div>

          </div>


          {/* ABNER */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">

            <img
              src="/images/abner.png"
              alt="Abner William"
              className="w-56 rounded-2xl object-cover"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold">Abner William</h3>
              <span className="inline-block bg-primary-500 text-black px-4 py-1 rounded-full text-sm font-bold my-3">
                DISPONÍVEL
              </span>
              <p className="text-neutral-400 mb-4">
                Barbeiro Especialista
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://instagram.com" target="_blank">
                  <Instagram className="text-primary-500" />
                </a>
                <a href="https://wa.me/5517992195185" target="_blank">
                  <Phone className="text-primary-500" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* INFORMAÇÕES DA BARBEARIA */}
      <section className="border-t border-white/10 px-6 py-16 max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Gimenes Barber Shop
        </h2>

        <p className="text-neutral-400 mb-10">
          A melhor experiência em barbearia da região de José Bonifácio.
          Tradição, estilo e o melhor atendimento para você.
        </p>

        <div className="space-y-6">

          <div>
            <h4 className="font-semibold">Contato</h4>
            <p className="text-neutral-400">
              R. Ademar de Barros, 278 - Centro - José Bonifácio/SP
            </p>
            <p className="text-neutral-400">
              (17) 99219-5185
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Horários</h4>
            <p className="text-neutral-400">
              Segunda à Sexta — 09h às 20h
            </p>
            <p className="text-neutral-400">
              Sábado — 08h às 18h
            </p>
          </div>

        </div>

      </section>


      <footer className="border-t border-white/10 text-center py-6 text-neutral-600 text-sm">
        © 2026 Gimenes Barber Shop • Todos os direitos reservados
      </footer>

    </div>
  )
}