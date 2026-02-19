import { ReactNode, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  RefreshCcw,
  Gift,
  Palette,
  ChevronRight,
  Star
} from 'lucide-react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/agendamentos', label: 'Agendamentos', icon: Calendar },
  { path: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { path: '/admin/barbeiros', label: 'Barbeiros', icon: Users },
  { path: '/admin/recuperar-clientes', label: 'Recuperar Clientes', icon: RefreshCcw },
  { path: '/admin/aniversariantes', label: 'Aniversariantes', icon: Gift },
  { path: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { path: '/admin/notificacoes', label: 'Notificações', icon: Bell },
  { path: '/admin/layout', label: 'Design & Layout', icon: Palette },
  { path: '/admin/configuracoes', label: 'Configurações', icon: Settings }
]

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-white/[0.05] rounded-3xl p-10 max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Acesso Restrito</h2>
          <p className="text-neutral-500 mb-8 text-sm font-medium">
            Esta área é exclusiva para barbeiros e administradores.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-primary-500 hover:scale-[1.02] text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
            >
              Ir para Agendamento
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/[0.05]"
            >
              Fazer Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-primary-500/30">
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-neutral-950 border-r border-white/[0.03] transform transition-transform duration-500 ease-in-out lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-neutral-900 border border-white/[0.05] rounded-xl flex items-center justify-center shadow-lg group">
              <Star className="w-6 h-6 text-primary-500 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg uppercase tracking-tighter leading-none">Gimenes</h1>
              <span className="text-primary-500 text-[9px] font-black uppercase tracking-[0.3em]">Master Admin</span>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-primary-500 text-black shadow-[0_10px_20px_rgba(197,160,89,0.15)] scale-[1.02]'
                      : 'text-neutral-500 hover:bg-neutral-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-black' : 'group-hover:text-primary-500'}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-black/50" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="p-6 bg-neutral-900/50 border border-white/[0.03] rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/20">
                  <User className="w-4 h-4 text-primary-500" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mb-1">Operador</span>
                  <span className="text-xs text-white font-black uppercase tracking-tight">{user?.username}</span>
               </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-black/80 backdrop-blur-xl border-b border-white/[0.03] px-8 h-24 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-neutral-900 border border-white/[0.05] rounded-xl hover:border-primary-500 transition-colors"
            >
              <Menu className="w-6 h-6 text-primary-500" />
            </button>
            <div className="flex flex-col">
               <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.4em] leading-none mb-2">Painel de Controle</span>
               <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{title}</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <div className="w-12 h-12 bg-neutral-900 border border-white/[0.05] rounded-xl flex items-center justify-center relative hover:border-primary-500 transition-colors cursor-pointer">
                <Bell className="w-5 h-5 text-neutral-500" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full ring-4 ring-black" />
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  )
}
