import cors from 'cors'
import express from 'express'
import appointmentRoutes from './routes/appointmentRoutes.js'
import departmentRoutes from './routes/departmentRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import intelligenceRoutes from './routes/intelligenceRoutes.js'
import patientRoutes from './routes/patientRoutes.js'

const app = express()
const port = process.env.PORT || 5001
app.use(cors())
app.use(express.json())

app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/intelligence', intelligenceRoutes)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'CarePoint API is running' })
})

app.listen(port, () => {
  console.log(`CarePoint API listening on http://localhost:${port}`)
})
