import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { CreditCard, QrCode, Smartphone } from 'lucide-react'

interface PaymentSettings {
  pix_key: string
  pix_name: string
  pix_city: string
  mercadopago_email: string
  mercadopago_enabled: string
  pix_enabled: string
}

export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    pix_key: '',
    pix_name: '',
    pix_city: '',
    mercadopago_email: '',
    mercadopago_enabled: '0',
    pix_enabled: '0'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/payment-settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.settings) {
        setSettings(prev => ({
          ...prev,
          ...data.settings
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof PaymentSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleToggle = (field: keyof PaymentSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field] === '1' ? '0' : '1'
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings })
      })
      if (response.ok) {
        alert('Configuracoes salvas com sucesso!')
      } else {
        alert('Erro ao salvar configuracoes')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configuracoes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Pagamentos">
      <div className="space-y-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Pix</h2>
              <p className="text-dark-400 text-sm">Configure sua chave Pix para receber pagamentos</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => handleToggle('pix_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pix_enabled === '1' ? 'bg-green-500' : 'bg-dark-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pix_enabled === '1' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-dark-400">Carregando...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-dark-300 text-sm mb-2">Chave Pix</label>
                <Input
                  type="text"
                  placeholder="CPF, CNPJ, Email, Telefone ou Chave Aleatoria"
                  value={settings.pix_key}
                  onChange={(e) => handleChange('pix_key', e.target.value)}
                />
                <p className="text-dark-500 text-xs mt-1">Sua chave Pix cadastrada no banco</p>
              </div>

              <div>
                <label className="block text-dark-300 text-sm mb-2">Nome do Beneficiario</label>
                <Input
                  type="text"
                  placeholder="Nome que aparece no Pix"
                  value={settings.pix_name}
                  onChange={(e) => handleChange('pix_name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-dark-300 text-sm mb-2">Cidade</label>
                <Input
                  type="text"
                  placeholder="Ex: SAO PAULO"
                  value={settings.pix_city}
                  onChange={(e) => handleChange('pix_city', e.target.value.toUpperCase())}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Mercado Pago</h2>
              <p className="text-dark-400 text-sm">Receba pagamentos via Mercado Pago</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => handleToggle('mercadopago_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.mercadopago_enabled === '1' ? 'bg-blue-500' : 'bg-dark-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.mercadopago_enabled === '1' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-dark-400">Carregando...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-dark-300 text-sm mb-2">Email do Mercado Pago</label>
                <Input
                  type="email"
                  placeholder="seu-email@mercadopago.com"
                  value={settings.mercadopago_email}
                  onChange={(e) => handleChange('mercadopago_email', e.target.value)}
                />
                <p className="text-dark-500 text-xs mt-1">Email da sua conta Mercado Pago para receber pagamentos</p>
              </div>

              <div className="bg-dark-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-dark-400 mt-0.5" />
                  <div>
                    <p className="text-dark-300 text-sm font-medium">Como funciona?</p>
                    <p className="text-dark-500 text-xs mt-1">
                      Ao ativar, o cliente podera pagar via Mercado Pago. Sera gerado um link de pagamento 
                      direcionando para sua conta. Voce recebera o valor diretamente no seu Mercado Pago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Salvar Configuracoes
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}



