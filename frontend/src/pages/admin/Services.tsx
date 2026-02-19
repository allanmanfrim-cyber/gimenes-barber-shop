import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { api } from '../../services/api'
import { Service } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: '',
    price: ''
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await api.services.list()
      setServices(data.services)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        duration_minutes: service.duration_minutes.toString(),
        price: service.price.toString()
      })
    } else {
      setEditingService(null)
      setFormData({ name: '', duration_minutes: '', price: '' })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      name: formData.name,
      duration_minutes: parseInt(formData.duration_minutes),
      price: parseFloat(formData.price)
    }

    try {
      if (editingService) {
        await api.services.update(editingService.id, data)
      } else {
        await api.services.create(data)
      }
      loadServices()
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      await api.services.update(service.id, { active: !service.active })
      loadServices()
    } catch (error) {
      console.error('Error toggling service:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este servico?')) return
    try {
      await api.services.delete(id)
      loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  return (
    <AdminLayout title="Servicos">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Novo Servico
          </Button>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-dark-400 p-6">Carregando...</p>
          ) : (
            <table className="w-full">
              <thead className="bg-dark-700/50">
                <tr>
                  <th className="text-left text-dark-300 font-medium p-4">Nome</th>
                  <th className="text-left text-dark-300 font-medium p-4">Duracao</th>
                  <th className="text-left text-dark-300 font-medium p-4">Preco</th>
                  <th className="text-left text-dark-300 font-medium p-4">Status</th>
                  <th className="text-right text-dark-300 font-medium p-4">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="p-4 text-white">{service.name}</td>
                    <td className="p-4 text-dark-300">{service.duration_minutes} min</td>
                    <td className="p-4 text-primary-500 font-medium">
                      R$ {service.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          service.active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-dark-600 text-dark-400 hover:bg-dark-500'
                        }`}
                      >
                        {service.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="p-2 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Editar Servico' : 'Novo Servico'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Servico"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Duracao (minutos)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            required
          />
          <Input
            label="Preco (R$)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Button type="submit" fullWidth>
            {editingService ? 'Salvar' : 'Criar'}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  )
}



