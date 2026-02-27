import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <div className="mb-10 text-center">
        <img
          src="/images/logo.png"
          alt="Gimenes Barber Shop"
          className="w-40 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold tracking-wide">
          GIMENES BARBER SHOP
        </h1>
        <p className="text-neutral-500 text-sm">
          Premium Barber
        </p>
      </div>

      <button
        onClick={() => navigate('/agendar')}
        className="bg-primary-500 text-black px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all"
      >
        Agendar Horário
      </button>

    </div>
  )
}