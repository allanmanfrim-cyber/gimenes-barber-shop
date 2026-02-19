import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scissors, User, ChevronUp, ChevronDown, LogIn } from 'lucide-react'

const TEST_CREDENTIALS = {
  barbeiro: { username: 'allan_barbeiro', password: 'senha123' },
  cliente: { username: 'cliente_teste', password: 'senha123' }
}

export function TestSwitcher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLoginAsBarbeiro = async () => {
    setLoading('barbeiro')
    try {
      const { username, password } = TEST_CREDENTIALS.barbeiro
      const success = await login(username, password)
      if (success) {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('Erro ao logar como barbeiro:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleLoginAsCliente = async () => {
    setLoading('cliente')
    try {
      if (isAuthenticated) {
        logout()
      }
      navigate('/')
    } catch (error) {
      console.error('Erro ao trocar para cliente:', error)
    } finally {
      setLoading(null)
    }
  }

  const getCurrentUserLabel = () => {
    if (!isAuthenticated) return 'Visitante'
    if (user?.role === 'admin') return 'Barbeiro'
    return 'Cliente'
  }

  const getCurrentUserColor = () => {
    if (!isAuthenticated) return 'bg-dark-600'
    if (user?.role === 'admin') return 'bg-primary-500'
    return 'bg-blue-500'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-dark-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getCurrentUserColor()}`} />
            <span className="text-sm font-medium text-white">
              {getCurrentUserLabel()}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-dark-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-dark-400" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-dark-700 p-2 space-y-2">
            <p className="text-xs text-dark-500 px-2 pb-1">Trocar perfil:</p>
            
            <button
              onClick={handleLoginAsBarbeiro}
              disabled={loading === 'barbeiro'}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                user?.role === 'admin'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-dark-700 text-dark-300'
              }`}
            >
              <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Scissors className="w-4 h-4 text-primary-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium">Barbeiro</p>
                <p className="text-xs text-dark-500">Acesso admin</p>
              </div>
              {loading === 'barbeiro' && (
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              )}
              {user?.role !== 'admin' && loading !== 'barbeiro' && (
                <LogIn className="w-4 h-4 text-dark-500" />
              )}
            </button>

            <button
              onClick={handleLoginAsCliente}
              disabled={loading === 'cliente'}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                !isAuthenticated
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-dark-700 text-dark-300'
              }`}
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-xs text-dark-500">Fazer agendamento</p>
              </div>
              {loading === 'cliente' && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
              {isAuthenticated && loading !== 'cliente' && (
                <LogIn className="w-4 h-4 text-dark-500" />
              )}
            </button>

            <div className="border-t border-dark-700 pt-2 mt-2">
              <p className="text-[10px] text-dark-600 px-2 text-center">
                Modo de teste - Dev only
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



