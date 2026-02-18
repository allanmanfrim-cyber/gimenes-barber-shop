import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { User as UserIcon, Camera, Phone } from 'lucide-react'
import { api } from '../../services/api'

export default function AdminProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    photo_url: ''
  })

  useEffect(() => {
    if (user && user.barberId) {
      loadProfile(user.barberId)
    } else {
      setLoading(false)
    }
  }, [user])

  const loadProfile = async (barberId: number) => {
    try {
      const data = await api.barbers.listAll()
      const myBarber = data.barbers.find((b: any) => b.id === barberId)
      if (myBarber) {
        setProfile({
          name: myBarber.name,
          phone: myBarber.whatsapp || '',
          photo_url: (myBarber as any).photo_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.barberId) {
      alert('Erro: ID do barbeiro não encontrado')
      return
    }
    
    setSaving(true)
    try {
      await api.barbers.update(user.barberId, {
        name: profile.name,
        whatsapp: profile.phone
      })
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Meu Perfil">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-dark-700 rounded-full overflow-hidden border-4 border-dark-600 flex items-center justify-center">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-dark-500" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">{profile.name || 'Seu Nome'}</h2>
            <p className="text-dark-400 text-sm">Personalize seus dados de atendimento</p>
          </div>

          {loading ? (
            <p className="text-dark-400 text-center">Carregando...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-dark-300 text-sm mb-2">Nome Público</label>
                <Input 
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Como o cliente verá seu nome"
                />
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-2">Telefone/WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <Input 
                    className="pl-10"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-2">URL da Foto</label>
                <Input 
                  value={profile.photo_url}
                  onChange={(e) => setProfile(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="Link da sua imagem"
                />
                <p className="text-dark-500 text-xs mt-1">Cole aqui o link de uma imagem para seu perfil</p>
              </div>

              <div className="pt-6">
                <Button type="submit" fullWidth loading={saving}>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
