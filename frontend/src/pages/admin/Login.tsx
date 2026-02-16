import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Scissors } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-dark-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Area Administrativa</h1>
          <p className="text-dark-400">Gimenes Barber Shop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
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

        <div className="mt-8 pt-8 border-t border-dark-800">
          <p className="text-dark-400 text-sm text-center mb-4">Acesso de Teste</p>
          <div className="grid grid-cols-3 gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setUsername('admin')
                setPassword('admin123')
              }}
            >
              Admin
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setUsername('junior')
                setPassword('junior123')
              }}
            >
              Junior
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setUsername('abner')
                setPassword('abner123')
              }}
            >
              Abner
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
