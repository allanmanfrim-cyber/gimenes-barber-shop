import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Barber } from '../../types'
import { User, Plus, X, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newBarber, setNewBarber] = useState({ name: '', username: '', password: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadBarbers()
  }, [])

  const loadBarbers = async () => {
    try {
      const response = await fetch('/api/admin/barbers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setBarbers(data.barbers)
    } catch (error) {
      console.error('Error loading barbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBarber)
      })

      if (response.ok) {
        setShowModal(false)
        setNewBarber({ name: '', username: '', password: '' })
        loadBarbers()
      } else {
        const data = await response.json()
        alert(data.message || 'Erro ao criar barbeiro')
      }
    } catch (error) {
      console.error('Error creating barber:', error)
      alert('Erro ao criar barbeiro')
    } finally {
      setCreating(false)
    }
  }

  const handleToggleActive = async (barber: Barber) => {
    try {
      await fetch(`/api/admin/barbers/${barber.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ active: barber.active ? 0 : 1 })
      })
      loadBarbers()
    } catch (error) {
      console.error('Error toggling barber:', error)
    }
  }

  const handleDeleteBarber = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este barbeiro? Todos os agendamentos vinculados a ele tambem serao removidos.')) return

    try {
      const response = await fetch(`/api/admin/barbers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        loadBarbers()
      } else {
        alert('Erro ao remover barbeiro')
      }
    } catch (error) {
      console.error('Error deleting barber:', error)
      alert('Erro ao remover barbeiro')
    }
  }

  return (
    <AdminLayout title="Barbeiros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Equipe</h2>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Barbeiro
          </Button>
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
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-dark-700 rounded-full overflow-hidden flex items-center justify-center">
                    {barber.photo_url ? (
                      <img src={barber.photo_url} alt={barber.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{barber.name}</h3>
                    <p className="text-dark-400 text-sm">Barbeiro</p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => handleDeleteBarber(barber.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Remover Barbeiro"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Novo Barbeiro</h3>
                <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateBarber} className="p-6 space-y-4">
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Nome Completo</label>
                  <Input 
                    required 
                    value={newBarber.name}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Carlos Silva" 
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Usuario (Login)</label>
                  <Input 
                    required 
                    value={newBarber.username}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                    placeholder="Ex: carlos.barber" 
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-sm mb-2">Senha Inicial</label>
                  <Input 
                    type="password" 
                    required 
                    value={newBarber.password}
                    onChange={(e) => setNewBarber(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Defina uma senha" 
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" fullWidth onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" fullWidth loading={creating}>
                    Criar Acesso
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
