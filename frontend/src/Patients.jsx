import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle, ArrowUpDown, Eye, LoaderCircle, Pencil, Plus,
  Search, Trash2, UserRound, X,
} from 'lucide-react'

const emptyPatient = {
  fullName: '', age: '', gender: '', contact: '', email: '', bloodGroup: '', address: '',
  doctorId: '', departmentId: '', condition: '', admissionDate: new Date().toISOString().slice(0, 10), status: 'Stable',
}

const patientStatuses = ['Stable', 'Monitoring', 'Critical', 'Recovering', 'Needs Follow-up']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function statusStyle(status) {
  if (status === 'Critical') return 'bg-rose-50 text-rose-700'
  if (status === 'Monitoring') return 'bg-orange-50 text-orange-700'
  if (status === 'Needs Follow-up') return 'bg-amber-50 text-amber-700'
  if (status === 'Recovering') return 'bg-blue-50 text-blue-700'
  return 'bg-emerald-50 text-emerald-700'
}

function Field({ label, name, value, onChange, type = 'text', required = true, ...props }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <input name={name} type={type} value={value ?? ''} onChange={onChange} required={required} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-2 focus:ring-teal/10" {...props} />
    </label>
  )
}

function PatientForm({ patient, doctors, departments, onClose, onSave }) {
  const [form, setForm] = useState(patient ? { ...patient } : { ...emptyPatient })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(patient)
  const selectedDoctor = doctors.find((doctor) => doctor.id === form.doctorId)
  const selectedDepartment = departments.find((department) => department.id === form.departmentId)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => {
      if (name === 'doctorId') {
        const doctor = doctors.find((item) => item.id === value)
        return { ...current, doctorId: value, departmentId: doctor?.departmentId || '' }
      }
      return { ...current, [name]: value }
    })
  }

  async function submitForm(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, age: Number(form.age) }, isEditing)
      onClose()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save patient. Please check the form and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="patient-form-title" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div><h2 id="patient-form-title" className="text-lg font-bold text-[#18344e]">{isEditing ? 'Edit patient' : 'Register a patient'}</h2><p className="mt-1 text-xs text-slate-500">Enter the patient information below.</p></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close form"><X size={18} /></button>
        </div>
        <form onSubmit={submitForm} className="space-y-5 p-5 sm:p-6">
          {error && <div role="alert" className="flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700"><AlertCircle size={16} className="shrink-0" />{error}</div>}
          <div><p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Personal details</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={updateField} placeholder="e.g. Jordan Lee" minLength={2} />
            <Field label="Age" name="age" value={form.age} onChange={updateField} type="number" min="0" max="120" />
            <label className="block text-xs font-semibold text-slate-600">Gender<select name="gender" value={form.gender} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none focus:border-teal"><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label>
            <label className="block text-xs font-semibold text-slate-600">Blood group<select name="bloodGroup" value={form.bloodGroup} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none focus:border-teal"><option value="">Select blood group</option>{bloodGroups.map((group) => <option key={group}>{group}</option>)}</select></label>
            <Field label="Contact number" name="contact" value={form.contact} onChange={updateField} type="tel" placeholder="555-0100" />
            <Field label="Email address" name="email" value={form.email} onChange={updateField} type="email" placeholder="patient@example.test" />
            <div className="sm:col-span-2"><Field label="Address" name="address" value={form.address} onChange={updateField} placeholder="Street, city" /></div>
          </div></div>
          <div><p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Care information</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-600">Assigned doctor<select name="doctorId" value={form.doctorId} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none focus:border-teal"><option value="">Select a doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</select></label>
            <div className="text-xs font-semibold text-slate-600">Department<div className="mt-1.5 flex min-h-[42px] items-center rounded-xl border border-slate-100 bg-slate-50 px-3 text-sm font-normal text-slate-600">{selectedDepartment?.name || 'Select a doctor first'}</div></div>
            <Field label="Medical condition" name="condition" value={form.condition} onChange={updateField} placeholder="e.g. Seasonal asthma" />
            <Field label="Admission date" name="admissionDate" value={form.admissionDate} onChange={updateField} type="date" />
            <label className="block text-xs font-semibold text-slate-600">Patient status<select name="status" value={form.status} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none focus:border-teal">{patientStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          </div></div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#117d7f] disabled:cursor-not-allowed disabled:opacity-60">{saving && <LoaderCircle size={14} className="animate-spin" />}{isEditing ? 'Save changes' : 'Register patient'}</button></div>
        </form>
      </section>
    </div>
  )
}

function PatientProfile({ patient, doctors, departments, onClose, onEdit }) {
  const doctor = doctors.find((item) => item.id === patient.doctorId)
  const department = departments.find((item) => item.id === patient.departmentId)
  const details = [
    ['Age', `${patient.age} years`], ['Gender', patient.gender], ['Blood group', patient.bloodGroup],
    ['Contact', patient.contact], ['Email', patient.email], ['Address', patient.address],
    ['Assigned doctor', doctor?.name || 'Unassigned'], ['Department', department?.name || 'Unassigned'],
    ['Condition', patient.condition], ['Admission date', patient.admissionDate],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="patient-profile-title" className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-[#17324d] p-5 text-white sm:p-6"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-bold">{patient.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><h2 id="patient-profile-title" className="text-lg font-bold">{patient.fullName}</h2><p className="mt-1 text-xs text-slate-300">Patient ID · {patient.id}</p></div></div><button onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Close profile"><X size={18} /></button></div>
        <div className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Current status</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(patient.status)}`}>{patient.status}</span></div><button onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-teal hover:text-teal"><Pencil size={14} /> Edit patient</button></div>
          <dl className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-700">{value}</dd></div>)}</dl>
          {patient.vitals && <div className="mt-5 rounded-xl bg-[#f4f8fb] p-4"><h3 className="mb-3 text-xs font-bold text-slate-700">Recorded vitals</h3><div className="grid grid-cols-3 gap-2 text-center"><div><p className="text-[10px] text-slate-400">Blood pressure</p><p className="mt-1 text-sm font-semibold text-slate-700">{patient.vitals.bloodPressure || '—'}</p></div><div><p className="text-[10px] text-slate-400">Heart rate</p><p className="mt-1 text-sm font-semibold text-slate-700">{patient.vitals.heartRate ? `${patient.vitals.heartRate} bpm` : '—'}</p></div><div><p className="text-[10px] text-slate-400">Temperature</p><p className="mt-1 text-sm font-semibold text-slate-700">{patient.vitals.temperature ? `${patient.vitals.temperature}°C` : '—'}</p></div></div></div>}
        </div>
      </section>
    </div>
  )
}

function Patients() {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formPatient, setFormPatient] = useState(null)
  const [profilePatient, setProfilePatient] = useState(null)
  const [sortByName, setSortByName] = useState(false)

  async function loadReferenceData() {
    setLoading(true)
    setError('')
    try {
      const [patientResponse, doctorResponse, departmentResponse] = await Promise.all([
        axios.get('/api/patients'), axios.get('/api/doctors'), axios.get('/api/departments'),
      ])
      setPatients(patientResponse.data)
      setDoctors(doctorResponse.data)
      setDepartments(departmentResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load patient information. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReferenceData() }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = patients.filter((patient) => {
      const matchesSearch = !query || patient.fullName.toLowerCase().includes(query) || patient.id.toLowerCase().includes(query)
      const matchesGender = !gender || patient.gender === gender
      const matchesStatus = !status || patient.status === status
      return matchesSearch && matchesGender && matchesStatus
    })
    return sortByName ? [...result].sort((first, second) => first.fullName.localeCompare(second.fullName)) : result
  }, [patients, search, gender, status, sortByName])

  async function savePatient(patient, isEditing) {
    if (isEditing) {
      const response = await axios.put(`/api/patients/${patient.id}`, patient)
      setPatients((current) => current.map((item) => item.id === response.data.id ? response.data : item))
      setNotice('Patient details updated successfully.')
    } else {
      const response = await axios.post('/api/patients', patient)
      setPatients((current) => [response.data, ...current])
      setNotice('Patient registered successfully.')
    }
  }

  async function deletePatient(patient) {
    const confirmed = window.confirm(`Delete ${patient.fullName} (${patient.id})? This also removes their appointments.`)
    if (!confirmed) return
    try {
      await axios.delete(`/api/patients/${patient.id}`)
      setPatients((current) => current.filter((item) => item.id !== patient.id))
      setProfilePatient(null)
      setNotice(`${patient.fullName} was deleted.`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this patient. Please try again.')
    }
  }

  const clearFilters = () => { setSearch(''); setGender(''); setStatus('') }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint directory</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Patient management</h2><p className="mt-1 text-sm text-slate-500">Register patients and keep their care information up to date.</p></div><button onClick={() => setFormPatient(false)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#117d7f]"><Plus size={16} /> Add new patient</button></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Total patients</p><p className="mt-2 text-2xl font-bold text-[#18344e]">{patients.length}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Currently monitoring</p><p className="mt-2 text-2xl font-bold text-orange-600">{patients.filter((patient) => patient.status === 'Monitoring').length}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Critical status</p><p className="mt-2 text-2xl font-bold text-rose-600">{patients.filter((patient) => patient.status === 'Critical').length}</p></div></div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div className="flex-1">{error}</div><button onClick={loadReferenceData} className="text-xs font-semibold underline">Retry</button></div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(22,48,72,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div><h3 className="text-sm font-bold text-[#18344e]">Registered patients</h3><p className="mt-1 text-xs text-slate-500">Showing {filteredPatients.length} of {patients.length} patients</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <label className="flex h-10 min-w-[210px] items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or patient ID" className="w-full text-xs outline-none placeholder:text-slate-400" /></label>
            <select value={gender} onChange={(event) => setGender(event.target.value)} aria-label="Filter by gender" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="">All genders</option><option>Female</option><option>Male</option><option>Other</option></select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="">All statuses</option>{patientStatuses.map((item) => <option key={item}>{item}</option>)}</select>
            {(search || gender || status) && <button onClick={clearFilters} className="h-10 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800">Clear</button>}
          </div>
        </div>

        {loading ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading patients...</div> : !error && filteredPatients.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><UserRound size={22} /></span><p className="mt-3 text-sm font-semibold text-slate-700">No patients found</p><p className="mt-1 text-xs text-slate-500">Try changing the filters or register a new patient.</p><button onClick={clearFilters} className="mt-3 text-xs font-semibold text-teal hover:text-teal-800">Clear filters</button></div> : !error && <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><th className="px-5 py-3">Patient <button onClick={() => setSortByName((current) => !current)} aria-label="Sort patients by name"><ArrowUpDown size={12} className="ml-1 inline" /></button></th><th className="px-4 py-3">Patient ID</th><th className="px-4 py-3">Age / Gender</th><th className="px-4 py-3">Department / Doctor</th><th className="px-4 py-3">Condition</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>{filteredPatients.map((patient) => { const doctor = doctors.find((item) => item.id === patient.doctorId); const department = departments.find((item) => item.id === patient.departmentId); return <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3f7] text-[10px] font-bold text-[#416e9a]">{patient.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="text-xs font-semibold text-slate-700">{patient.fullName}</span></div></td><td className="px-4 py-3.5 text-xs font-medium text-slate-500">{patient.id}</td><td className="px-4 py-3.5 text-xs text-slate-500">{patient.age} · {patient.gender}</td><td className="px-4 py-3.5"><span className="block text-xs font-medium text-slate-600">{department?.name || '—'}</span><span className="mt-1 block text-[10px] text-slate-400">{doctor?.name || 'Unassigned'}</span></td><td className="max-w-44 truncate px-4 py-3.5 text-xs text-slate-500">{patient.condition}</td><td className="px-4 py-3.5"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle(patient.status)}`}>{patient.status}</span></td><td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button onClick={() => setProfilePatient(patient)} title="View profile" aria-label={`View ${patient.fullName}`} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Eye size={15} /></button><button onClick={() => setFormPatient(patient)} title="Edit patient" aria-label={`Edit ${patient.fullName}`} className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal"><Pencil size={15} /></button><button onClick={() => deletePatient(patient)} title="Delete patient" aria-label={`Delete ${patient.fullName}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button></div></td></tr> })}</tbody></table></div>}
      </section>

      {formPatient !== null && <PatientForm patient={formPatient || null} doctors={doctors} departments={departments} onClose={() => setFormPatient(null)} onSave={savePatient} />}
      {profilePatient && <PatientProfile patient={profilePatient} doctors={doctors} departments={departments} onClose={() => setProfilePatient(null)} onEdit={() => { setProfilePatient(null); setFormPatient(profilePatient) }} />}
    </div>
  )
}

export default Patients
