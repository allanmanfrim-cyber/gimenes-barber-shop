import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

import { initDatabase } from './database/init.js'
import servicesRoutes from './routes/services.js'
import barbersRoutes from './routes/barbers.js'
import availabilityRoutes from './routes/availability.js'
import appointmentsRoutes from './routes/appointments.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import businessHoursRoutes from './routes/businessHours.js'
import paymentsRoutes from './routes/payments.js'

const dataDir = path.join(process.cwd(), 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

initDatabase()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/services', servicesRoutes)
app.use('/api/barbers', barbersRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/business-hours', businessHoursRoutes)
app.use('/api/payments', paymentsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})
