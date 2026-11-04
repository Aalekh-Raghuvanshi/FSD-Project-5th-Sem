import { Router } from 'express'
import { departments, doctors, patients } from '../data/sampleData.js'

const router = Router()

router.get('/', (_request, response) => {
  const departmentSummary = departments.map((department) => ({
    ...department,
    doctorCount: doctors.filter((doctor) => doctor.departmentId === department.id).length,
    patientCount: patients.filter((patient) => patient.departmentId === department.id).length,
  }))

  response.json(departmentSummary)
})

export default router
