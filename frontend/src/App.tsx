import { ThemeProvider } from './context/ThemeContext'
import AdminLayoutSettings from './pages/admin/LayoutSettings'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Booking from './pages/Booking'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAppointments from './pages/admin/Appointments'
import AdminServices from './pages/admin/Services'
import AdminBarbers from './pages/admin/Barbers'
import AdminCustomerRecovery from './pages/admin/CustomerRecovery'
import AdminBirthdays from './pages/admin/Birthdays'
import AdminPayments from './pages/admin/Payments'
import AdminNotifications from './pages/admin/Notifications'
import AdminSettings from './pages/admin/Settings'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agendar" element={<Booking />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/agendamentos" element={<AdminAppointments />} />
            <Route path="/admin/servicos" element={<AdminServices />} />
            <Route path="/admin/barbeiros" element={<AdminBarbers />} />
            <Route path="/admin/recuperar-clientes" element={<AdminCustomerRecovery />} />
            <Route path="/admin/aniversariantes" element={<AdminBirthdays />} />
            <Route path="/admin/pagamentos" element={<AdminPayments />} />
            <Route path="/admin/notificacoes" element={<AdminNotifications />} />
            <Route path="/admin/configuracoes" element={<AdminSettings />} />
            <Route path="/admin/layout" element={<AdminLayoutSettings />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
