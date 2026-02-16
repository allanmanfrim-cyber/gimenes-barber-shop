import { ReactNode, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  CreditCard,
  Wallet,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/agendamentos', label: 'Agendamentos', icon: Calendar },
  { path: '/admin/servicos', label: 'Servicos', icon: Scissors },
  { path: '/admin/barbeiros', label: 'Barbeiros', icon: Users },
  { path: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { path: '/admin/perfil', label: 'Meu Perfil', icon: UserCircle },
  { path: '/admin/config-pagamentos', label: 'Recebimentos', icon: Wallet },
  { path: '/admin/configuracoes', label: 'Configuracoes', icon: Settings }
]

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  if (!isAuthenticated) return null

  const filteredMenuItems = menuItems.filter(item => {
    if (user?.role === 'barber') {
      return ['Dashboard', 'Agendamentos', 'Meu Perfil'].includes(item.label)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-dark-900 font-bold">G</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-sm">Gimenes</h1>
                <p className="text-dark-400 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-dark-800 rounded"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-dark-300 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-dark-900 border-b border-dark-800 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-dark-800 rounded-lg"
            >
              <Menu className="w-5 h-5 text-dark-300" />
            </button>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
