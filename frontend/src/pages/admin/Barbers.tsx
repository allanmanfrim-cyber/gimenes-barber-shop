import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Barber } from '../../types'
import { api } from '../../services/api'
import { User as UserIcon, Plus, Edit2, Phone, Mail, X, Check } from 'lucide-react'

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '' })

  useEffect(() => {
    loadBarbers()
  }, [])

  const loadBarbers = async () => {
    console.log("🔄 CARREGANDO BARBEIROS...")
    try {
      const data = await api.barbers.listAll()
      console.log("📥 DADOS RECEBIDOS:", data)
      setBarbers(data.barbers)
    } catch (error) {
      console.error('❌ Error loading barbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (barber: Barber) => {
    try {
      await api.barbers.update(barber.id, { active: !barber.active })
      await loadBarbers()
    } catch (error) {
      console.error('❌ Error toggling barber:', error)
    }
  }

  const handleOpenModal = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber)
      setFormData({
        name: barber.name,
        whatsapp: barber.whatsapp || '',
        email: barber.email || ''
      })
    } else {
      setEditingBarber(null)
      setFormData({ name: '', whatsapp: '', email: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("📤 ENVIANDO DADOS:", formData)

    try {
      if (editingBarber) {
        console.log("✏️ EDITANDO BARBEIRO ID:", editingBarber.id)
        await api.barbers.update(editingBarber.id, formData)
      } else {
        console.log("➕ CRIANDO NOVO BARBEIRO")
        await api.barbers.create(formData)
      }

      console.log("✅ SUCESSO AO SALVAR")

      setShowModal(false)
      await loadBarbers()

    } catch (error) {
      console.error("❌ ERRO AO SALVAR BARBEIRO:", error)
    }
  }

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <AdminLayout title="Barbeiros">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-dark-900 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Barbeiro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <p className="text-dark-400">Carregando...</p>
          ) : (
            barbers.map((barber) => (
              <div
                key={barber.id}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center overflow-hidden">
                    {barber.photo_url ? (
                      <img src={barber.photo_url} alt={barber.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-8 h-8 text-primary-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{barber.name}</h3>
                      <button
                        onClick={() => handleOpenModal(barber)}
                        className="text-dark-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    {barber.whatsapp && (
                      <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
                        <Phone className="w-4 h-4" />
                        <span>{barber.whatsapp}</span>
                      </div>
                    )}

                    {barber.email && (
                      <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{barber.email}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleActive(barber)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      barber.active
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-dark-600 text-dark-400 hover:bg-dark-500'
                    }`}
                  >
                    {barber.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">
                {editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: formatWhatsapp(e.target.value) })
                  }
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-dark-600 text-white px-4 py-3 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-dark-900 px-4 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}