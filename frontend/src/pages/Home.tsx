import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Sparkles,
  Clock,
  Instagram,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="text-center px-6 pt-16 pb-12 border-b border-white/10">

        <img
          src="/images/logo.png"
          alt="Gimenes Barber Shop"
          className="w-96 mx-auto mb-10"
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
              src="/images/Júnior.png"
              alt="Júnior Gimenes"
              className="w-56 h-56 rounded-2xl object-cover"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold">Júnior Gimenes</h3>

              <p className="text-neutral-400 mb-4">
                Barbeiro Especialista
              </p>

              <div className="flex gap-6 justify-center md:justify-start">

                <a
                  href="https://www.instagram.com/_juniorgimenes_/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="text-primary-500 hover:scale-110 transition-all" />
                </a>

                <a
                  href="https://wa.me/5517992195185"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="text-primary-500 hover:scale-110 transition-all" />
                </a>

              </div>
            </div>

          </div>


          {/* ABNER */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">

            <img
              src="/images/Abner.png"
              alt="Abner William"
              className="w-56 h-56 rounded-2xl object-cover"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold">Abner William</h3>

              <p className="text-neutral-400 mb-4">
                Barbeiro Especialista
              </p>

              <div className="flex gap-6 justify-center md:justify-start">

                <a
                  href="https://www.instagram.com/barbeiroabner_ofc/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="text-primary-500 hover:scale-110 transition-all" />
                </a>

                <a
                  href="https://wa.me/5517981128073"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="text-primary-500 hover:scale-110 transition-all" />
                </a>

              </div>
            </div>

          </div>

        </div>

      </section>


      {/* RODAPÉ */}
      <footer className="border-t border-white/10 px-6 py-16 max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-neutral-900 p-4 rounded-xl text-primary-500 font-bold">
            G
          </div>
          <h2 className="text-2xl font-bold">
            Gimenes Barber Shop
          </h2>
        </div>

        <p className="text-neutral-400 mb-10">
          A melhor experiência em barbearia da região de José Bonifácio.
          Tradição, estilo e o melhor atendimento para você.
        </p>

        <h3 className="font-bold mb-4">CONTATOS</h3>

        <div className="space-y-4 mb-8">

          <div className="flex items-start gap-3">
            <MapPin className="text-primary-500 mt-1" />
            <div>
              <p>R. Ademar de Barros, 278</p>
              <p className="text-neutral-400 text-sm">
                Centro - José Bonifácio/SP
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Instagram className="text-primary-500 mt-1" />
            <a
              href="https://www.instagram.com/gimenesbarberjr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-all"
            >
              @gimenesbarberjr
            </a>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-primary-500 mt-1" />
            <div>
              <p>(17) 99219-5185</p>
              <p className="text-neutral-400 text-sm">
                WhatsApp Oficial
              </p>
            </div>
          </div>

        </div>

        <h3 className="font-bold mb-4">HORÁRIOS</h3>

        <div className="space-y-4 mb-10">

          <div className="flex items-start gap-3">
            <Clock className="text-primary-500 mt-1" />
            <div>
              <p>Segunda à Sexta</p>
              <p className="text-neutral-400 text-sm">
                09h às 20h
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-primary-500 mt-1" />
            <div>
              <p>Sábado</p>
              <p className="text-neutral-400 text-sm">
                08h às 18h
              </p>
            </div>
          </div>

        </div>

        <div className="text-center mb-6">
          <a
            href="/admin"
            className="text-primary-500 underline"
          >
            Acesso Administrador
          </a>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-neutral-600 text-sm">
          © 2026 Gimenes Barber Shop • Todos os direitos reservados
          <br />
          Desenvolvido por <span className="text-primary-500">Agência Frita Kuka</span>
        </div>

      </footer>

    </div>
  )
}