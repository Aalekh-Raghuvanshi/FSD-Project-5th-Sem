import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle, CalendarDays, Clock3, LoaderCircle, Mail, Pencil,
  Phone, Plus, Search, Stethoscope, Trash2, X,
} from 'lucide-react'

const availabilityOptions = ['Available', 'In Surgery', 'Off Duty']
const blankDoctor = { name: '', specialization: '', departmentId: '', contact: '', email: '', experience: '', availability: 'Available' }

function availabilityStyle(availability) {
  if (availability === 'Available') return 'bg-emerald-50 text-emerald-700'
  if (availability === 'In Surgery') return 'bg-orange-50 text-orange-700'
  return 'bg-slate-100 text-slate-600'
}

function DoctorForm({ doctor, departments, onClose, onSave }) {
  const [form, setForm] = useState(doctor ? { ...doctor } : { ...blankDoctor })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(doctor)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, experience: Number(form.experience) }, editing)
      onClose()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save doctor details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="doctor-form-title" className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 id="doctor-form-title" className="text-lg font-bold text-[#18344e]">{editing ? 'Edit doctor' : 'Add a doctor'}</h2><p className="mt-1 text-xs text-slate-500">Keep the medical team directory up to date.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close form"><X size={18} /></button></div>
        <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
          {error && <div role="alert" className="flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700"><AlertCircle size={16} className="shrink-0" />{error}</div>}
          <label className="block text-xs font-semibold text-slate-600">Doctor name<input name="name" value={form.name} onChange={updateField} required minLength={3} placeholder="e.g. Dr. Jordan Lee" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-600">Specialization<input name="specialization" value={form.specialization} onChange={updateField} required placeholder="e.g. Cardiology" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
            <label className="block text-xs font-semibold text-slate-600">Department<select name="departmentId" value={form.departmentId} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal"><option value="">Select department</option>{departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}</select></label>
            <label className="block text-xs font-semibold text-slate-600">Contact number<input name="contact" type="tel" value={form.contact} onChange={updateField} required placeholder="555-0100" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
            <label className="block text-xs font-semibold text-slate-600">Email address<input name="email" type="email" value={form.email} onChange={updateField} required placeholder="doctor@example.test" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
            <label className="block text-xs font-semibold text-slate-600">Experience (years)<input name="experience" type="number" min="0" max="80" value={form.experience} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label>
            <label className="block text-xs font-semibold text-slate-600">Availability<select name="availability" value={form.availability} onChange={updateField} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal">{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#117d7f] disabled:opacity-60">{saving && <LoaderCircle size={14} className="animate-spin" />}{editing ? 'Save changes' : 'Add doctor'}</button></div>
        </form>
      </section>
    </div>
  )
}

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formDoctor, setFormDoctor] = useState(null)

  async function loadDoctors() {
    setLoading(true)
    setError('')
    try {
      const [doctorResponse, departmentResponse] = await Promise.all([axios.get('/api/doctors'), axios.get('/api/departments')])
      setDoctors(doctorResponse.data)
      setDepartments(departmentResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load doctors. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase()
    return doctors.filter((doctor) => {
      const matchesSearch = !query || doctor.name.toLowerCase().includes(query) || doctor.id.toLowerCase().includes(query) || doctor.specialization.toLowerCase().includes(query)
      const matchesDepartment = !departmentFilter || doctor.departmentId === departmentFilter
      const matchesAvailability = !availabilityFilter || doctor.availability === availabilityFilter
      return matchesSearch && matchesDepartment && matchesAvailability
    })
  }, [doctors, search, departmentFilter, availabilityFilter])

  async function saveDoctor(doctor, editing) {
    if (editing) {
      const response = await axios.put(`/api/doctors/${doctor.id}`, doctor)
      setDoctors((current) => current.map((item) => item.id === response.data.id ? response.data : item))
      setNotice('Doctor details updated successfully.')
    } else {
      const response = await axios.post('/api/doctors', doctor)
      setDoctors((current) => [response.data, ...current])
      setNotice('Doctor added successfully.')
    }
  }

  async function deleteDoctor(doctor) {
    if (!window.confirm(`Delete ${doctor.name}? Doctors with assigned patients must be reassigned first.`)) return
    try {
      await axios.delete(`/api/doctors/${doctor.id}`)
      setDoctors((current) => current.filter((item) => item.id !== doctor.id))
      setNotice(`${doctor.name} was removed.`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this doctor.')
    }
  }

  const availableCount = doctors.filter((doctor) => doctor.availability === 'Available').length

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint directory</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Doctor management</h2><p className="mt-1 text-sm text-slate-500">Browse the medical team and manage doctor availability.</p></div><button onClick={() => setFormDoctor(false)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#117d7f]"><Plus size={16} /> Add new doctor</button></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Total doctors</p><p className="mt-2 text-2xl font-bold text-[#18344e]">{doctors.length}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Available now</p><p className="mt-2 text-2xl font-bold text-emerald-600">{availableCount}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Departments covered</p><p className="mt-2 text-2xl font-bold text-teal">{new Set(doctors.map((doctor) => doctor.departmentId)).size}</p></div></div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div className="flex-1">{error}</div><button onClick={loadDoctors} className="text-xs font-semibold underline">Retry</button></div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-bold text-[#18344e]">Medical team</h3><p className="mt-1 text-xs text-slate-500">Showing {filteredDoctors.length} of {doctors.length} doctors</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or specialty" className="w-full text-xs outline-none placeholder:text-slate-400" /></label><select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="">All departments</option>{departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}</select><select aria-label="Filter by availability" value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="">All availability</option>{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select></div></div>

        {loading ? <div className="flex min-h-52 items-center justify-center gap-2 rounded-2xl bg-white text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading doctors...</div> : !error && filteredDoctors.length === 0 ? <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center"><Stethoscope size={24} className="text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No doctors found</p><p className="mt-1 text-xs text-slate-500">Adjust your filters or add a doctor to the team.</p></div> : !error && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{filteredDoctors.map((doctor) => { const department = departments.find((item) => item.id === doctor.departmentId); const initials = doctor.name.replace(/^Dr\.\s*/i, '').split(' ').map((part) => part[0]).slice(0, 2).join(''); return <article key={doctor.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5f4] text-sm font-bold text-teal">{initials}</span><div><h4 className="text-sm font-bold text-[#18344e]">{doctor.name}</h4><p className="mt-1 text-xs text-slate-500">{doctor.specialization}</p></div></div><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${availabilityStyle(doctor.availability)}`}>{doctor.availability}</span></div><div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-500"><div className="flex items-center gap-2"><Stethoscope size={14} className="text-slate-400" />{department?.name || 'Department not set'} <span className="ml-auto text-[10px] text-slate-400">{doctor.id}</span></div><div className="flex items-center gap-2"><CalendarDays size={14} className="text-slate-400" />{doctor.experience} years experience</div><div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" />{doctor.contact}</div><div className="flex min-w-0 items-center gap-2"><Mail size={14} className="shrink-0 text-slate-400" /><span className="truncate">{doctor.email}</span></div></div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400"><Clock3 size={12} /> {doctor.availability === 'Available' ? 'Accepting patients' : doctor.availability}</span><div className="flex gap-1"><button onClick={() => setFormDoctor(doctor)} title="Edit doctor" aria-label={`Edit ${doctor.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal"><Pencil size={15} /></button><button onClick={() => deleteDoctor(doctor)} title="Delete doctor" aria-label={`Delete ${doctor.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button></div></div></article> })}</div>}
      </section>

      {formDoctor !== null && <DoctorForm doctor={formDoctor || null} departments={departments} onClose={() => setFormDoctor(null)} onSave={saveDoctor} />}
    </div>
  )
}

export default Doctors
