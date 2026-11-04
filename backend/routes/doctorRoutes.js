import { Router } from 'express'
import { appointments, departments, doctors, patients } from '../data/sampleData.js'

const router = Router()
const availabilityOptions = ['Available', 'In Surgery', 'Off Duty']
const requiredFields = ['name', 'specialization', 'departmentId', 'contact', 'email', 'experience', 'availability']

function validateDoctor(doctor, currentId) {
  for (const field of requiredFields) {
    if (doctor[field] === undefined || doctor[field] === null || doctor[field] === '') {
      return `${field} is required`
    }
  }

  if (typeof doctor.name !== 'string' || doctor.name.trim().length < 3) {
    return 'Doctor name must contain at least 3 characters'
  }

  if (typeof doctor.specialization !== 'string' || doctor.specialization.trim().length < 2) {
    return 'Specialization must contain at least 2 characters'
  }

  if (typeof doctor.contact !== 'string' || doctor.contact.trim().length < 5) {
    return 'Enter a valid contact number'
  }

  if (typeof doctor.email !== 'string') return 'Enter a valid email address'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctor.email)) {
    return 'Enter a valid email address'
  }

  const emailIsUsed = doctors.some((item) => item.id !== currentId && item.email.toLowerCase() === doctor.email.toLowerCase())
  if (emailIsUsed) return 'A doctor with this email address already exists'

  if (!Number.isInteger(Number(doctor.experience)) || Number(doctor.experience) < 0 || Number(doctor.experience) > 80) {
    return 'Experience must be a whole number between 0 and 80'
  }

  if (!availabilityOptions.includes(doctor.availability)) {
    return `Availability must be one of: ${availabilityOptions.join(', ')}`
  }

  if (!departments.some((department) => department.id === doctor.departmentId)) {
    return 'Department does not exist'
  }

  return null
}

function nextDoctorId() {
  const largestId = doctors.reduce((largest, doctor) => {
    const number = Number(doctor.id.replace('DR-', ''))
    return Number.isNaN(number) ? largest : Math.max(largest, number)
  }, 0)

  return `DR-${String(largestId + 1).padStart(3, '0')}`
}

router.get('/', (request, response) => {
  const { q = '', departmentId, availability } = request.query
  const search = String(q).trim().toLowerCase()
  const results = doctors.filter((doctor) => {
    const matchesSearch = !search || doctor.name.toLowerCase().includes(search) || doctor.id.toLowerCase().includes(search) || doctor.specialization.toLowerCase().includes(search)
    const matchesDepartment = !departmentId || doctor.departmentId === departmentId
    const matchesAvailability = !availability || doctor.availability.toLowerCase() === String(availability).toLowerCase()
    return matchesSearch && matchesDepartment && matchesAvailability
  })

  return response.json(results)
})

router.get('/:id', (request, response) => {
  const doctor = doctors.find((item) => item.id === request.params.id)
  if (!doctor) return response.status(404).json({ message: 'Doctor not found' })
  return response.json(doctor)
})

router.post('/', (request, response) => {
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be a doctor object' })
  }

  const doctor = { ...request.body, experience: Number(request.body.experience) }
  const validationError = validateDoctor(doctor)
  if (validationError) return response.status(400).json({ message: validationError })

  doctor.id = nextDoctorId()
  doctors.push(doctor)
  return response.status(201).json(doctor)
})

router.put('/:id', (request, response) => {
  const doctorIndex = doctors.findIndex((item) => item.id === request.params.id)
  if (doctorIndex === -1) return response.status(404).json({ message: 'Doctor not found' })
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be a doctor object' })
  }

  const currentDoctor = doctors[doctorIndex]
  const updatedDoctor = {
    ...currentDoctor,
    ...request.body,
    id: currentDoctor.id,
    experience: Number(request.body.experience ?? currentDoctor.experience),
  }
  const validationError = validateDoctor(updatedDoctor, currentDoctor.id)
  if (validationError) return response.status(400).json({ message: validationError })

  const hasAssignedRecords = patients.some((patient) => patient.doctorId === currentDoctor.id)
    || appointments.some((appointment) => appointment.doctorId === currentDoctor.id)
  if (hasAssignedRecords && updatedDoctor.departmentId !== currentDoctor.departmentId) {
    return response.status(409).json({ message: 'This doctor has assigned patients or appointments. Reassign them before changing departments.' })
  }

  doctors[doctorIndex] = updatedDoctor
  return response.json(updatedDoctor)
})

router.delete('/:id', (request, response) => {
  const doctorIndex = doctors.findIndex((item) => item.id === request.params.id)
  if (doctorIndex === -1) return response.status(404).json({ message: 'Doctor not found' })

  const doctor = doctors[doctorIndex]
  const hasAssignedPatients = patients.some((patient) => patient.doctorId === doctor.id)
  if (hasAssignedPatients) {
    return response.status(409).json({ message: 'This doctor has assigned patients. Reassign them before deleting the doctor.' })
  }

  doctors.splice(doctorIndex, 1)
  for (let index = appointments.length - 1; index >= 0; index -= 1) {
    if (appointments[index].doctorId === doctor.id) appointments.splice(index, 1)
  }

  return response.json({ message: 'Doctor deleted successfully', doctor })
})

export default router
