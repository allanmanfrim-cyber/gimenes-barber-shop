import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Scissors, User } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(username, password)
    
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Usuario ou senha invalidos')
    }
    
    setLoading(false)
  }

  const handleTestLogin = async (userType: 'barbeiro' | 'cliente') => {
    setError('')
    setTestLoading(userType)
    
    const credentials = {
      barbeiro: { u: 'allan_barbeiro', p: 'senha123' },
      cliente: { u: 'cliente_teste', p: 'senha123' }
    }

    const { u, p } = credentials[userType]
    const success = await login(u, p)

    if (success) {
      if (userType === 'barbeiro') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } else {
      setError(`Erro ao entrar como ${userType}. Verifique se o servidor esta rodando.`)
    }
    setTestLoading(null)
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-dark-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Area Administrativa</h1>
          <p className="text-dark-400">Gimenes Barber Shop</p>
        </div>

        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 shadow-xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuario"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />

            <Button type="submit" fullWidth loading={loading}>
              Entrar
            </Button>
          </form>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dark-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-950 px-2 text-dark-500 font-medium">Testes Rápidos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTestLogin('barbeiro')}
              disabled={!!testLoading}
              className="flex items-center justify-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:border-primary-500/50 group"
            >
              {testLoading === 'barbeiro' ? (
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4 text-primary-500" />
              )}
              <span>Barbeiro</span>
            </button>

            <button
              onClick={() => handleTestLogin('cliente')}
              disabled={!!testLoading}
              className="flex items-center justify-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:border-blue-500/50 group"
            >
              {testLoading === 'cliente' ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <User className="w-4 h-4 text-blue-500" />
              )}
              <span>Cliente</span>
            </button>
          </div>
          
          <p className="text-[10px] text-dark-600 text-center font-medium">
            MODO DE TESTE ATIVADO
          </p>
        </div>
      </div>
    </div>
  )
}
