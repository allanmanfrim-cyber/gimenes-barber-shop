import { Barber } from '../../types'

interface BarberSelectProps {
  barbers: Barber[]
  loading: boolean
  onSelect: (barber: Barber) => void
}

export function BarberSelect({
  barbers,
  loading,
  onSelect
}: BarberSelectProps) {

  if (loading) {
    return <p className="text-center text-neutral-500">Carregando...</p>
  }

  // 🔥 ORDEM MANUAL DEFINIDA
  const orderedBarbers = [
    barbers.find(b => b.name === 'Júnior Gimenes'),
    barbers.find(b => b.name === 'Abner William')
  ].filter(Boolean)

  return (
    <div className="flex justify-center">
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl">

        {orderedBarbers.map((barber) => (
          <button
            key={barber!.id}
            onClick={() => onSelect(barber!)}
            className="group bg-neutral-900 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 border border-neutral-800"
          >
            <img
              src={`/images/${barber!.name === 'Júnior Gimenes' ? 'junior.png' : 'abner.png'}`}
              alt={barber!.name}
              className="w-full h-80 object-cover"
            />

            <div className="p-6 text-center">
              <p className="text-xs text-primary-500 uppercase tracking-wide mb-2">
                Especialista
              </p>

              <h3 className="text-xl font-bold text-white">
                {barber!.name}
              </h3>
            </div>
          </button>
        ))}

      </div>
    </div>
  )
}