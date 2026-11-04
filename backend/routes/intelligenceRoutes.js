import { Router } from 'express'
import { appointments, departments, doctors, patients } from '../data/sampleData.js'

const router = Router()

function getVitals(patient) {
  const bloodPressure = patient.vitals?.bloodPressure || ''
  const [systolic, diastolic] = bloodPressure.split('/').map(Number)
  return {
    systolic: Number.isNaN(systolic) ? 0 : systolic,
    diastolic: Number.isNaN(diastolic) ? 0 : diastolic,
    heartRate: Number(patient.vitals?.heartRate) || 0,
    temperature: Number(patient.vitals?.temperature) || 0,
  }
}

function classifyPatient(patient) {
  const vitals = getVitals(patient)
  const riskReasons = []
  const highRisk = patient.status === 'Critical'
    || vitals.systolic >= 160
    || vitals.diastolic >= 100
    || vitals.heartRate >= 110
    || vitals.temperature >= 39

  if (patient.status === 'Critical') riskReasons.push('Patient status is marked critical')
  if (vitals.systolic >= 160 || vitals.diastolic >= 100) riskReasons.push('Recorded blood pressure is in the high range')
  if (vitals.heartRate >= 110) riskReasons.push('Recorded heart rate is 110 bpm or higher')
  if (vitals.temperature >= 39) riskReasons.push('Recorded temperature is 39°C or higher')

  if (highRisk) return { level: 'High Risk', reasons: riskReasons }

  const mediumRisk = patient.age >= 65
    || ['Monitoring', 'Needs Follow-up'].includes(patient.status)
    || vitals.systolic >= 140
    || vitals.diastolic >= 90
    || vitals.heartRate >= 100
    || vitals.temperature >= 38

  if (patient.age >= 65) riskReasons.push('Patient is 65 years or older')
  if (['Monitoring', 'Needs Follow-up'].includes(patient.status)) riskReasons.push(`Patient status is ${patient.status.toLowerCase()}`)
  if (vitals.systolic >= 140 || vitals.diastolic >= 90) riskReasons.push('Recorded blood pressure is above the demonstration range')
  if (vitals.heartRate >= 100) riskReasons.push('Recorded heart rate is 100 bpm or higher')
  if (vitals.temperature >= 38) riskReasons.push('Recorded temperature is 38°C or higher')

  if (mediumRisk) return { level: 'Medium Risk', reasons: riskReasons }
  return { level: 'Low Risk', reasons: ['No demonstration risk conditions were triggered'] }
}

function createPatientAlerts(patient) {
  const vitals = getVitals(patient)
  const alerts = []

  if (patient.status === 'Critical') {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'High', title: 'Critical patient status', message: 'The patient is manually marked as critical.' })
  }
  if (vitals.systolic >= 160 || vitals.diastolic >= 100) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'High', title: 'High blood pressure reading', message: `Recorded blood pressure is ${patient.vitals.bloodPressure}.` })
  } else if (vitals.systolic >= 140 || vitals.diastolic >= 90) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'Medium', title: 'Blood pressure follow-up', message: `Recorded blood pressure is ${patient.vitals.bloodPressure}.` })
  }
  if (vitals.heartRate >= 110) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'High', title: 'Elevated heart rate', message: `Recorded heart rate is ${vitals.heartRate} bpm.` })
  } else if (vitals.heartRate >= 100) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'Medium', title: 'Heart rate follow-up', message: `Recorded heart rate is ${vitals.heartRate} bpm.` })
  }
  if (vitals.temperature >= 39) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'High', title: 'High temperature reading', message: `Recorded temperature is ${vitals.temperature}°C.` })
  } else if (vitals.temperature >= 38) {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'Medium', title: 'Temperature follow-up', message: `Recorded temperature is ${vitals.temperature}°C.` })
  }
  if (patient.status === 'Needs Follow-up') {
    alerts.push({ patientId: patient.id, patientName: patient.fullName, level: 'Medium', title: 'Follow-up required', message: 'The patient record is marked as needing follow-up.' })
  }

  return alerts
}

function getUpcomingAppointments() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return appointments
    .filter((appointment) => appointment.date >= todayString && ['Scheduled', 'Pending'].includes(appointment.status))
    .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`))
}

function getPatientSummary(patient) {
  const risk = classifyPatient(patient)
  const doctor = doctors.find((item) => item.id === patient.doctorId) || null
  const department = departments.find((item) => item.id === patient.departmentId) || null
  const upcomingAppointments = getUpcomingAppointments()
    .filter((appointment) => appointment.patientId === patient.id)
    .map((appointment) => ({ ...appointment, doctorName: doctors.find((item) => item.id === appointment.doctorId)?.name || 'Unassigned' }))

  return {
    patient,
    medicalHistory: patient.condition,
    currentStatus: patient.status,
    riskCategory: risk.level,
    riskReasons: risk.reasons,
    assignedDoctor: doctor,
    department,
    upcomingAppointments,
    disclaimer: 'Demonstration feature only. This rule-based summary is not a clinically validated diagnostic tool.',
  }
}

router.get('/overview', (_request, response) => {
  const riskCounts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 }
  for (const patient of patients) {
    const risk = classifyPatient(patient)
    riskCounts[risk.level] += 1
  }

  const alerts = patients.flatMap(createPatientAlerts)
  const requiringFollowUp = patients
    .filter((patient) => patient.status === 'Needs Follow-up' || classifyPatient(patient).level === 'High Risk')
    .map((patient) => ({
      id: patient.id,
      name: patient.fullName,
      status: patient.status,
      riskCategory: classifyPatient(patient).level,
      observation: patient.status === 'Needs Follow-up' ? 'Follow-up is marked as needed' : 'High risk conditions were triggered',
    }))

  return response.json({
    totalPatients: patients.length,
    riskCounts,
    alertCount: alerts.length,
    highPriorityAlertCount: alerts.filter((alert) => alert.level === 'High').length,
    followUpCount: requiringFollowUp.length,
    upcomingAppointmentCount: getUpcomingAppointments().length,
    requiringFollowUp,
    disclaimer: 'Demonstration feature only. Risk categories and alerts are generated by simple rules and are not clinically validated.',
  })
})

router.get('/alerts', (_request, response) => {
  const alerts = patients.flatMap(createPatientAlerts)
  return response.json(alerts)
})

router.get('/patients/:id', (request, response) => {
  const patient = patients.find((item) => item.id === request.params.id)
  if (!patient) return response.status(404).json({ message: 'Patient not found' })
  return response.json(getPatientSummary(patient))
})

export default router
