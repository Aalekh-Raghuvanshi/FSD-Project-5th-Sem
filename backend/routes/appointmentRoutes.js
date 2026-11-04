import { Router } from 'express'
import { appointments, doctors, patients } from '../data/sampleData.js'

const router = Router()
const allowedStatuses = ['Scheduled', 'Completed', 'Cancelled', 'Pending']
const requiredFields = ['patientId', 'doctorId', 'date', 'time', 'reason', 'status']

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function validateAppointment(appointment, currentId) {
  for (const field of requiredFields) {
    if (appointment[field] === undefined || appointment[field] === null || appointment[field] === '') {
      return `${field} is required`
    }
  }

  if (!patients.some((patient) => patient.id === appointment.patientId)) {
    return 'Select a valid patient'
  }

  const doctor = doctors.find((item) => item.id === appointment.doctorId)
  if (!doctor) return 'Select a valid doctor'

  if (!isValidDate(appointment.date)) return 'Appointment date must use YYYY-MM-DD format'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointment.time)) return 'Appointment time must use 24-hour HH:MM format'
  if (typeof appointment.reason !== 'string' || appointment.reason.trim().length < 3) {
    return 'Reason for visit must contain at least 3 characters'
  }
  if (!allowedStatuses.includes(appointment.status)) {
    return `Status must be one of: ${allowedStatuses.join(', ')}`
  }

  const timeIsTaken = appointment.status !== 'Cancelled' && appointments.some((item) => (
    item.id !== currentId
    && item.doctorId === appointment.doctorId
    && item.date === appointment.date
    && item.time === appointment.time
    && item.status !== 'Cancelled'
  ))
  if (timeIsTaken) return 'This doctor already has an appointment at that time'

  return null
}

function nextAppointmentId() {
  const largestId = appointments.reduce((largest, appointment) => {
    const number = Number(appointment.id.replace('AP-', ''))
    return Number.isNaN(number) ? largest : Math.max(largest, number)
  }, 2000)

  return `AP-${largestId + 1}`
}

router.get('/', (request, response) => {
  const { q = '', status, date } = request.query
  const search = String(q).trim().toLowerCase()
  const results = appointments.filter((appointment) => {
    const patient = patients.find((item) => item.id === appointment.patientId)
    const doctor = doctors.find((item) => item.id === appointment.doctorId)
    const matchesSearch = !search
      || appointment.id.toLowerCase().includes(search)
      || patient?.fullName.toLowerCase().includes(search)
      || doctor?.name.toLowerCase().includes(search)
    const matchesStatus = !status || appointment.status.toLowerCase() === String(status).toLowerCase()
    const matchesDate = !date || appointment.date === date
    return matchesSearch && matchesStatus && matchesDate
  })

  return response.json(results)
})

router.post('/', (request, response) => {
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be an appointment object' })
  }

  const doctor = doctors.find((item) => item.id === request.body.doctorId)
  const appointment = {
    ...request.body,
    departmentId: doctor?.departmentId || request.body.departmentId,
  }
  const validationError = validateAppointment(appointment)
  if (validationError) return response.status(400).json({ message: validationError })

  appointment.id = nextAppointmentId()
  appointments.push(appointment)
  return response.status(201).json(appointment)
})

router.put('/:id', (request, response) => {
  const appointmentIndex = appointments.findIndex((item) => item.id === request.params.id)
  if (appointmentIndex === -1) return response.status(404).json({ message: 'Appointment not found' })
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be an appointment object' })
  }

  const currentAppointment = appointments[appointmentIndex]
  const updatedAppointment = { ...currentAppointment, ...request.body, id: currentAppointment.id }
  const doctor = doctors.find((item) => item.id === updatedAppointment.doctorId)
  if (doctor) updatedAppointment.departmentId = doctor.departmentId

  const validationError = validateAppointment(updatedAppointment, currentAppointment.id)
  if (validationError) return response.status(400).json({ message: validationError })

  appointments[appointmentIndex] = updatedAppointment
  return response.json(updatedAppointment)
})

router.delete('/:id', (request, response) => {
  const appointmentIndex = appointments.findIndex((item) => item.id === request.params.id)
  if (appointmentIndex === -1) return response.status(404).json({ message: 'Appointment not found' })

  const [appointment] = appointments.splice(appointmentIndex, 1)
  return response.json({ message: 'Appointment deleted successfully', appointment })
})

export default router
