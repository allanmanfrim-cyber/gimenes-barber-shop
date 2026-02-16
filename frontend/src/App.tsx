import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Booking from './pages/Booking'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAppointments from './pages/admin/Appointments'
import AdminServices from './pages/admin/Services'
import AdminBarbers from './pages/admin/Barbers'
import AdminPayments from './pages/admin/Payments'
import AdminPaymentSettings from './pages/admin/PaymentSettings'
import AdminProfile from './pages/admin/Profile'
import AdminSettings from './pages/admin/Settings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<Booking />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/agendamentos" element={<AdminAppointments />} />
          <Route path="/admin/servicos" element={<AdminServices />} />
          <Route path="/admin/barbeiros" element={<AdminBarbers />} />
          <Route path="/admin/pagamentos" element={<AdminPayments />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
          <Route path="/admin/config-pagamentos" element={<AdminPaymentSettings />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
