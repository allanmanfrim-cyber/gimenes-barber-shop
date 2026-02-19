import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Scissors, User, Lock, ShieldCheck, Star } from 'lucide-react'

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
      setError('Usuário ou senha inválidos')
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
      setError(`Erro ao entrar como ${userType}. Verifique se o servidor está rodando.`)
    }
    setTestLoading(null)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12 font-sans selection:bg-primary-500/30">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary-500/20 rounded-[2rem] blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-neutral-900 border border-white/[0.05] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
               <Star className="w-10 h-10 text-primary-500 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Painel de Acesso</h1>
          <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.4em]">Barbearia Premium SaaS</p>
        </div>

        <div className="bg-neutral-900/50 border border-white/[0.03] rounded-[2.5rem] p-10 shadow-2xl mb-8 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center animate-in shake-1 duration-300">
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <div className="relative group/field">
               <Input
                label="Nome de Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="allan_barbeiro"
                className="pl-14"
              />
              <User className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within/field:text-primary-500 transition-colors" />
            </div>

            <div className="relative group/field">
              <Input
                label="Senha de Acesso"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-14"
              />
              <Lock className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within/field:text-primary-500 transition-colors" />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              className="h-16 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(197,160,89,0.25)] hover:scale-105 transition-all mt-4"
            >
              Entrar no Sistema
            </Button>
          </form>
        </div>

        <div className="space-y-6 px-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/[0.03]"></span>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black">
              <span className="bg-black px-4 text-neutral-600">Acesso Rápido (Sandbox)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTestLogin('barbeiro')}
              disabled={!!testLoading}
              className="flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-white/[0.03] text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:border-primary-500/30 group"
            >
              {testLoading === 'barbeiro' ? (
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Scissors className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
              )}
              <span>Barbeiro</span>
            </button>

            <button
              onClick={() => handleTestLogin('cliente')}
              disabled={!!testLoading}
              className="flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-white/[0.03] text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:border-blue-500/30 group"
            >
              {testLoading === 'cliente' ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              )}
              <span>Cliente</span>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-4">
             <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
             <p className="text-[8px] text-neutral-800 font-black uppercase tracking-[0.5em] text-center">
              Sistema de Autenticação Seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
