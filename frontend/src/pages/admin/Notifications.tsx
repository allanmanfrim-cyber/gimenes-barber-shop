import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Notification, NotificationStats } from '../../types'
import { api } from '../../services/api'
import { Bell, Mail, MessageSquare, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await api.notifications.list()
      setNotifications(data.notifications)
      setStats(data.stats)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviado'
      case 'failed': return 'Falhou'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'whatsapp' 
      ? <MessageSquare className="w-4 h-4 text-green-500" />
      : <Mail className="w-4 h-4 text-blue-500" />
  }

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.status === filter
  )

  return (
    <AdminLayout title="Notificacoes">
      <div className="space-y-6">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-dark-400">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.sent}</p>
                  <p className="text-sm text-dark-400">Enviados</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.failed}</p>
                  <p className="text-sm text-dark-400">Falhas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-sm text-dark-400">Pendentes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'sent', 'failed', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-500 text-dark-900'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
              >
                {f === 'all' ? 'Todos' : getStatusLabel(f)}
              </button>
            ))}
          </div>
          
          <button
            onClick={loadNotifications}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-dark-400">Carregando...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">Nenhuma notificacao encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-dark-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      {getStatusIcon(notification.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          {notification.type === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                        </span>
                        <span className="text-dark-500">-</span>
                        <span className="text-dark-400 text-sm">
                          {notification.recipient_type === 'client' ? 'Cliente' : 'Barbeiro'}
                        </span>
                      </div>
                      
                      <p className="text-dark-400 text-sm truncate">
                        {notification.recipient_contact}
                      </p>
                      
                      {notification.error_message && (
                        <p className="text-red-400 text-xs mt-1">
                          {notification.error_message}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        notification.status === 'sent' 
                          ? 'bg-green-500/20 text-green-400'
                          : notification.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {getStatusLabel(notification.status)}
                      </span>
                      
                      <p className="text-dark-500 text-xs mt-1">
                        {notification.sent_at 
                          ? format(new Date(notification.sent_at), "dd/MM HH:mm", { locale: ptBR })
                          : format(new Date(notification.created_at), "dd/MM HH:mm", { locale: ptBR })
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}







