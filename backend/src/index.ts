import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { initDatabase } from './database/init.js'
import servicesRoutes from './routes/services.js'
import barbersRoutes from './routes/barbers.js'
import availabilityRoutes from './routes/availability.js'
import appointmentsRoutes from './routes/appointments.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import businessHoursRoutes from './routes/businessHours.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

initDatabase()

const app = express()
const PORT = Number(process.env.PORT) || 3001

// Forçar HTTPS em produção
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`)
    }
    next()
  })
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gimenesbarber.com.br', 'https://www.gimenesbarber.com.br']
    : '*'
}))
app.use(express.json())

app.use('/api/services', servicesRoutes)
app.use('/api/barbers', barbersRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/business-hours', businessHoursRoutes)

// Servir Frontend em Produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'))
    }
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
