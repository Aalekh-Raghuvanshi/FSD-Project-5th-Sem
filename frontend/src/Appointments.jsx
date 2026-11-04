import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle, CalendarDays, CheckCircle2, Clock3, LoaderCircle,
  Plus, Search, Stethoscope, X,
} from 'lucide-react'

const appointmentStatuses = ['Scheduled', 'Pending', 'Completed', 'Cancelled']

function localDate() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

function statusClass(status) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700'
  if (status === 'Cancelled') return 'bg-slate-100 text-slate-500'
  if (status === 'Pending') return 'bg-orange-50 text-orange-700'
  return 'bg-blue-50 text-blue-700'
}

function AppointmentForm({ patients, doctors, onClose, onSave }) {
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: localDate(), time: '', reason: '', status: 'Scheduled' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not schedule appointment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedDoctor = doctors.find((doctor) => doctor.id === form.doctorId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="appointment-form-title" className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 id="appointment-form-title" className="text-lg font-bold text-[#18344e]">Schedule appointment</h2><p className="mt-1 text-xs text-slate-500">Choose a patient, doctor, and visit time.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close form"><X size={18} /></button></div>
        <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
          {error && <div role="alert" className="flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700"><AlertCircle size={16} className="shrink-0" />{error}</div>}
          <label className="block text-xs font-semibold text-slate-600">Patient<select name="patientId" value={form.patientId} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal"><option value="">Select a patient</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName} · {patient.id}</option>)}</select></label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-600">Doctor<select name="doctorId" value={form.doctorId} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal"><option value="">Select a doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} · {doctor.specialization}</option>)}</select></label><div className="text-xs font-semibold text-slate-600">Department<div className="mt-1.5 flex min-h-[42px] items-center rounded-xl border border-slate-100 bg-slate-50 px-3 text-sm font-normal text-slate-600">{selectedDoctor?.departmentName || selectedDoctor?.specialization || 'Select a doctor first'}</div></div></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-600">Date<input name="date" type="date" value={form.date} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label><label className="block text-xs font-semibold text-slate-600">Time<input name="time" type="time" value={form.time} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label></div>
          <label className="block text-xs font-semibold text-slate-600">Reason for visit<textarea name="reason" value={form.reason} onChange={updateField} required minLength={3} rows="3" placeholder="Briefly describe the visit" className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#117d7f] disabled:opacity-60">{saving && <LoaderCircle size={14} className="animate-spin" />}Schedule visit</button></div>
        </form>
      </section>
    </div>
  )
}

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [appointmentResponse, patientResponse, doctorResponse, departmentResponse] = await Promise.all([
        axios.get('/api/appointments'), axios.get('/api/patients'), axios.get('/api/doctors'), axios.get('/api/departments'),
      ])
      setAppointments(appointmentResponse.data)
      setPatients(patientResponse.data)
      setDoctors(doctorResponse.data.map((doctor) => ({
        ...doctor,
        departmentName: departmentResponse.data.find((department) => department.id === doctor.departmentId)?.name,
      })))
      setDepartments(departmentResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load appointments. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return appointments.filter((appointment) => {
      const patient = patients.find((item) => item.id === appointment.patientId)
      const doctor = doctors.find((item) => item.id === appointment.doctorId)
      const matchesSearch = !query || appointment.id.toLowerCase().includes(query) || patient?.fullName.toLowerCase().includes(query) || doctor?.name.toLowerCase().includes(query)
      const matchesStatus = !statusFilter || appointment.status === statusFilter
      const matchesDate = !dateFilter || appointment.date === dateFilter
      return matchesSearch && matchesStatus && matchesDate
    }).sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`))
  }, [appointments, patients, doctors, search, statusFilter, dateFilter])

  async function scheduleAppointment(appointment) {
    const response = await axios.post('/api/appointments', appointment)
    setAppointments((current) => [...current, response.data])
    setNotice('Appointment scheduled successfully.')
  }

  async function updateStatus(appointment, status) {
    try {
      const response = await axios.put(`/api/appointments/${appointment.id}`, { status })
      setAppointments((current) => current.map((item) => item.id === appointment.id ? response.data : item))
      setNotice(`Appointment marked ${status.toLowerCase()}.`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update appointment status.')
    }
  }

  const today = localDate()
  const todayCount = appointments.filter((appointment) => appointment.date === today && appointment.status !== 'Cancelled').length
  const pendingCount = appointments.filter((appointment) => appointment.status === 'Pending').length
  const completedCount = appointments.filter((appointment) => appointment.status === 'Completed').length

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint schedule</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Appointment management</h2><p className="mt-1 text-sm text-slate-500">Schedule visits and keep track of appointment status.</p></div><button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#117d7f]"><Plus size={16} /> Schedule appointment</button></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Today's appointments</p><p className="mt-2 text-2xl font-bold text-[#18344e]">{todayCount}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Pending confirmation</p><p className="mt-2 text-2xl font-bold text-orange-600">{pendingCount}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Completed visits</p><p className="mt-2 text-2xl font-bold text-emerald-600">{completedCount}</p></div></div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div className="flex-1">{error}</div><button onClick={loadData} className="text-xs font-semibold underline">Retry</button></div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(22,48,72,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="text-sm font-bold text-[#18344e]">All appointments</h3><p className="mt-1 text-xs text-slate-500">Showing {filteredAppointments.length} of {appointments.length} appointments</p></div><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><label className="flex h-10 min-w-[210px] items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient or doctor" className="w-full text-xs outline-none placeholder:text-slate-400" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by appointment status" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="">All statuses</option>{appointmentStatuses.map((status) => <option key={status}>{status}</option>)}</select><input value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} type="date" aria-label="Filter by date" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal" />{(statusFilter || dateFilter || search) && <button onClick={() => { setSearch(''); setStatusFilter(''); setDateFilter('') }} className="h-10 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800">Clear</button>}</div></div>

        {loading ? <div className="flex min-h-60 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading appointments...</div> : !error && filteredAppointments.length === 0 ? <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center"><CalendarDays size={25} className="text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No appointments found</p><p className="mt-1 text-xs text-slate-500">Adjust your filters or schedule a new visit.</p></div> : !error && <div className="overflow-x-auto"><table className="w-full min-w-[930px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><th className="px-5 py-3">Appointment</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Doctor / Department</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-5 py-3">Update</th></tr></thead><tbody>{filteredAppointments.map((appointment) => { const patient = patients.find((item) => item.id === appointment.patientId); const doctor = doctors.find((item) => item.id === appointment.doctorId); const department = departments.find((item) => item.id === appointment.departmentId); return <tr key={appointment.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5"><span className="block text-xs font-semibold text-slate-700">{appointment.date}</span><span className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11} />{appointment.time} · {appointment.id}</span></td><td className="px-4 py-3.5"><span className="block text-xs font-semibold text-slate-700">{patient?.fullName || 'Patient removed'}</span><span className="mt-1 block text-[10px] text-slate-400">{patient?.id || appointment.patientId}</span></td><td className="px-4 py-3.5"><span className="block text-xs font-medium text-slate-600">{doctor?.name || 'Doctor removed'}</span><span className="mt-1 block text-[10px] text-slate-400">{department?.name || '—'}</span></td><td className="max-w-48 truncate px-4 py-3.5 text-xs text-slate-500">{appointment.reason}</td><td className="px-4 py-3.5"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass(appointment.status)}`}>{appointment.status}</span></td><td className="px-5 py-3.5">{appointment.status !== 'Cancelled' && appointment.status !== 'Completed' ? <select value={appointment.status} onChange={(event) => updateStatus(appointment, event.target.value)} aria-label={`Change status for ${appointment.id}`} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-600 outline-none focus:border-teal"><option>Scheduled</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select> : <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">{appointment.status === 'Completed' ? <CheckCircle2 size={13} className="text-emerald-500" /> : null}{appointment.status === 'Cancelled' ? 'No action' : 'Finished'}</span>}</td></tr> })}</tbody></table></div>}
      </section>

      {showForm && <AppointmentForm patients={patients} doctors={doctors} onClose={() => setShowForm(false)} onSave={scheduleAppointment} />}
    </div>
  )
}

export default Appointments
