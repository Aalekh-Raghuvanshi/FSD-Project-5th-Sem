import { Router } from 'express'
import { appointments, departments, doctors, patients } from '../data/sampleData.js'

const router = Router()

const requiredFields = [
  'fullName', 'age', 'gender', 'contact', 'email', 'bloodGroup', 'address',
  'doctorId', 'departmentId', 'condition', 'admissionDate', 'status',
]
const allowedGenders = ['Male', 'Female', 'Other']
const allowedStatuses = ['Stable', 'Monitoring', 'Critical', 'Recovering', 'Needs Follow-up']

function validatePatient(patient) {
  for (const field of requiredFields) {
    if (patient[field] === undefined || patient[field] === null || patient[field] === '') {
      return `${field} is required`
    }
  }

  if (typeof patient.fullName !== 'string' || patient.fullName.trim().length < 2) {
    return 'Full name must contain at least 2 characters'
  }

  if (!Number.isInteger(Number(patient.age)) || Number(patient.age) < 0 || Number(patient.age) > 120) {
    return 'Age must be a whole number between 0 and 120'
  }

  if (!allowedGenders.includes(patient.gender)) {
    return `Gender must be one of: ${allowedGenders.join(', ')}`
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
    return 'Enter a valid email address'
  }

  if (!allowedStatuses.includes(patient.status)) {
    return `Status must be one of: ${allowedStatuses.join(', ')}`
  }

  if (Number.isNaN(Date.parse(patient.admissionDate))) {
    return 'Admission date must be a valid date'
  }

  const doctor = doctors.find((item) => item.id === patient.doctorId)
  if (!doctor) return 'Assigned doctor does not exist'

  const department = departments.find((item) => item.id === patient.departmentId)
  if (!department) return 'Department does not exist'
  if (doctor.departmentId !== patient.departmentId) {
    return 'Assigned doctor must belong to the selected department'
  }

  return null
}

function nextPatientId() {
  const largestId = patients.reduce((largest, patient) => {
    const number = Number(patient.id.replace('PT-', ''))
    return Number.isNaN(number) ? largest : Math.max(largest, number)
  }, 1000)

  return `PT-${largestId + 1}`
}

router.get('/', (request, response) => {
  const { q = '', gender, status } = request.query
  const search = String(q).trim().toLowerCase()

  const results = patients.filter((patient) => {
    const matchesSearch = !search || patient.fullName.toLowerCase().includes(search) || patient.id.toLowerCase().includes(search)
    const matchesGender = !gender || patient.gender.toLowerCase() === String(gender).toLowerCase()
    const matchesStatus = !status || patient.status.toLowerCase() === String(status).toLowerCase()
    return matchesSearch && matchesGender && matchesStatus
  })

  response.json(results)
})

router.get('/:id', (request, response) => {
  const patient = patients.find((item) => item.id === request.params.id)

  if (!patient) {
    return response.status(404).json({ message: 'Patient not found' })
  }

  return response.json(patient)
})

router.post('/', (request, response) => {
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be a patient object' })
  }

  const patient = { ...request.body, age: Number(request.body.age) }
  const validationError = validatePatient(patient)

  if (validationError) {
    return response.status(400).json({ message: validationError })
  }

  patient.id = nextPatientId()
  patients.push(patient)
  return response.status(201).json(patient)
})

router.put('/:id', (request, response) => {
  const patientIndex = patients.findIndex((item) => item.id === request.params.id)

  if (patientIndex === -1) {
    return response.status(404).json({ message: 'Patient not found' })
  }

  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Request body must be a patient object' })
  }

  const updatedPatient = {
    ...patients[patientIndex],
    ...request.body,
    id: patients[patientIndex].id,
    age: Number(request.body.age ?? patients[patientIndex].age),
  }
  const validationError = validatePatient(updatedPatient)

  if (validationError) {
    return response.status(400).json({ message: validationError })
  }

  patients[patientIndex] = updatedPatient
  return response.json(updatedPatient)
})

router.delete('/:id', (request, response) => {
  const patientIndex = patients.findIndex((item) => item.id === request.params.id)

  if (patientIndex === -1) {
    return response.status(404).json({ message: 'Patient not found' })
  }

  const [removedPatient] = patients.splice(patientIndex, 1)
  for (let index = appointments.length - 1; index >= 0; index -= 1) {
    if (appointments[index].patientId === removedPatient.id) {
      appointments.splice(index, 1)
    }
  }

  return response.json({ message: 'Patient deleted successfully', patient: removedPatient })
})

export default router
