import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle, AlertTriangle, CalendarDays, CheckCircle2, Clock3,
  HeartPulse, LoaderCircle, Search, ShieldAlert, Stethoscope,
  UserRound,
} from 'lucide-react'

const riskStyles = {
  'High Risk': 'bg-rose-50 text-rose-700 border-rose-100',
  'Medium Risk': 'bg-orange-50 text-orange-700 border-orange-100',
  'Low Risk': 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

function Intelligence() {
  const [overview, setOverview] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [patientSummary, setPatientSummary] = useState(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileError, setProfileError] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const [overviewResponse, alertsResponse, patientsResponse] = await Promise.all([
        axios.get('/api/intelligence/overview'),
        axios.get('/api/intelligence/alerts'),
        axios.get('/api/patients'),
      ])
      setOverview(overviewResponse.data)
      setAlerts(alertsResponse.data)
      setPatients(patientsResponse.data)
      setSelectedPatientId((current) => current || patientsResponse.data.find((patient) => patient.status === 'Critical')?.id || patientsResponse.data[0]?.id || '')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load intelligence information. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  useEffect(() => {
    if (!selectedPatientId) {
      setPatientSummary(null)
      return undefined
    }

    let active = true
    setProfileLoading(true)
    setProfileError('')
    axios.get(`/api/intelligence/patients/${selectedPatientId}`)
      .then((response) => { if (active) setPatientSummary(response.data) })
      .catch((requestError) => {
        if (active) setProfileError(requestError.response?.data?.message || 'Could not load this patient summary.')
      })
      .finally(() => { if (active) setProfileLoading(false) })

    return () => { active = false }
  }, [selectedPatientId])

  const visiblePatients = useMemo(() => {
    const query = patientSearch.trim().toLowerCase()
    return patients.filter((patient) => !query || patient.fullName.toLowerCase().includes(query) || patient.id.toLowerCase().includes(query))
  }, [patients, patientSearch])

  if (loading) {
    return <div className="flex min-h-[55vh] items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={19} className="animate-spin text-teal" /> Loading patient intelligence...</div>
  }

  if (error) {
    return <div role="alert" className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700"><AlertCircle size={19} /><span className="flex-1">{error}</span><button onClick={loadDashboard} className="text-xs font-semibold underline">Retry</button></div>
  }

  const riskCards = [
    { title: 'High risk', count: overview.riskCounts['High Risk'], tone: 'border-l-rose-400 text-rose-600', icon: ShieldAlert },
    { title: 'Medium risk', count: overview.riskCounts['Medium Risk'], tone: 'border-l-orange-400 text-orange-600', icon: HeartPulse },
    { title: 'Low risk', count: overview.riskCounts['Low Risk'], tone: 'border-l-emerald-400 text-emerald-600', icon: CheckCircle2 },
    { title: 'Active alerts', count: overview.alertCount, tone: 'border-l-blue-400 text-blue-600', icon: AlertTriangle },
  ]

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div><p className="text-sm text-slate-500">CarePoint patient support</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Patient intelligence</h2><p className="mt-1 text-sm text-slate-500">A clear view of patient records that may need attention.</p></div>

      <div role="note" className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-5 text-blue-900"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><ShieldAlert size={15} /></span><p><strong>Demonstration only.</strong> Risk categories and alerts are generated with simple rules from sample records. This feature is not clinically validated and must not be used for diagnosis or treatment decisions.</p></div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{riskCards.map(({ title, count, tone, icon: Icon }) => <article key={title} className={`rounded-2xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${tone}`}><div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-500">{title}</p><Icon size={18} /></div><p className="mt-3 text-2xl font-bold text-[#18344e]">{count}</p><p className="mt-1 text-[10px] text-slate-400">of {overview.totalPatients} registered patients</p></article>)}</section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="text-sm font-bold text-[#18344e]">Health alerts</h3><p className="mt-1 text-xs text-slate-500">{overview.highPriorityAlertCount} high priority · {alerts.length} total signals</p></div><span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700">{alerts.length} alerts</span></div>{alerts.length === 0 ? <p className="p-6 text-sm text-slate-500">No alerts have been generated from the current records.</p> : <div className="max-h-[420px] divide-y divide-slate-50 overflow-y-auto">{alerts.map((alert, index) => <button key={`${alert.patientId}-${alert.title}-${index}`} onClick={() => setSelectedPatientId(alert.patientId)} className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${alert.level === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}><AlertTriangle size={16} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-slate-700">{alert.title}</span><span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${alert.level === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-orange-50 text-orange-700'}`}>{alert.level}</span></span><span className="mt-1 block text-[10px] text-slate-500">{alert.patientName} · {alert.patientId}</span><span className="mt-1 block text-[11px] leading-4 text-slate-500">{alert.message}</span></span><span className="pt-1 text-[10px] font-semibold text-teal">View</span></button>)}</div>}</article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-[#18344e]">Patients needing follow-up</h3><p className="mt-1 text-xs text-slate-500">High risk or marked for follow-up</p></div><span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-700">{overview.followUpCount}</span></div>{overview.requiringFollowUp.length === 0 ? <div className="flex min-h-40 flex-col items-center justify-center text-center"><CheckCircle2 size={25} className="text-emerald-500" /><p className="mt-3 text-sm font-semibold text-slate-700">No follow-ups flagged</p></div> : <div className="space-y-2">{overview.requiringFollowUp.map((patient) => <button key={patient.id} onClick={() => setSelectedPatientId(patient.id)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-teal/30 hover:bg-teal-50/30"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf3f7] text-[10px] font-bold text-[#416e9a]">{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-700">{patient.name}</span><span className="mt-1 block truncate text-[10px] text-slate-400">{patient.observation}</span></span><span className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${riskStyles[patient.riskCategory]}`}>{patient.riskCategory}</span></button>)}</div>}<div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[10px] text-slate-400"><CalendarDays size={13} className="text-teal" /> {overview.upcomingAppointmentCount} upcoming scheduled or pending appointments</div></article>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-4"><h3 className="text-sm font-bold text-[#18344e]">Patient records</h3><p className="mt-1 text-xs text-slate-500">Select a patient to inspect their summary.</p></div><label className="mb-3 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-teal"><Search size={14} className="text-slate-400" /><input value={patientSearch} onChange={(event) => setPatientSearch(event.target.value)} placeholder="Find patient" className="w-full text-xs outline-none placeholder:text-slate-400" /></label><div className="max-h-[360px] space-y-1 overflow-y-auto">{visiblePatients.map((patient) => <button key={patient.id} onClick={() => setSelectedPatientId(patient.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedPatientId === patient.id ? 'bg-[#eaf6f5]' : 'hover:bg-slate-50'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${selectedPatientId === patient.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-500'}`}>{patient.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-700">{patient.fullName}</span><span className="mt-0.5 block text-[10px] text-slate-400">{patient.id} · {patient.status}</span></span><UserRound size={14} className="text-slate-300" /></button>)}</div></article>

        <article className="min-h-[350px] rounded-2xl border border-slate-100 bg-white shadow-sm">{profileLoading ? <div className="flex min-h-[350px] items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading patient summary...</div> : profileError ? <div role="alert" className="m-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{profileError}</div> : patientSummary && <><div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5f4] text-teal"><UserRound size={20} /></span><div><h3 className="text-base font-bold text-[#18344e]">{patientSummary.patient.fullName}</h3><p className="mt-1 text-xs text-slate-500">{patientSummary.patient.id} · {patientSummary.patient.age} years · {patientSummary.patient.gender}</p></div></div><span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${riskStyles[patientSummary.riskCategory]}`}>{patientSummary.riskCategory}</span></div><div className="space-y-5 p-5 sm:p-6"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Current status</p><p className="mt-1 text-xs font-semibold text-slate-700">{patientSummary.currentStatus}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Blood pressure</p><p className="mt-1 text-xs font-semibold text-slate-700">{patientSummary.patient.vitals?.bloodPressure || '—'}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Heart rate</p><p className="mt-1 text-xs font-semibold text-slate-700">{patientSummary.patient.vitals?.heartRate ? `${patientSummary.patient.vitals.heartRate} bpm` : '—'}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Temperature</p><p className="mt-1 text-xs font-semibold text-slate-700">{patientSummary.patient.vitals?.temperature ? `${patientSummary.patient.vitals.temperature}°C` : '—'}</p></div></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><div><h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"><HeartPulse size={14} className="text-teal" /> Recorded condition</h4><p className="text-xs text-slate-600">{patientSummary.medicalHistory || 'No condition recorded'}</p></div><div><h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"><Stethoscope size={14} className="text-teal" /> Care team</h4><p className="text-xs text-slate-600">{patientSummary.assignedDoctor?.name || 'No doctor assigned'}</p><p className="mt-1 text-[10px] text-slate-400">{patientSummary.department?.name || 'Department not set'}</p></div></div><div><h4 className="mb-2 text-xs font-bold text-slate-700">Why this category?</h4><ul className="space-y-1.5">{patientSummary.riskReasons.map((reason) => <li key={reason} className="flex items-start gap-2 text-[11px] leading-4 text-slate-500"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />{reason}</li>)}</ul></div><div><h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"><CalendarDays size={14} className="text-teal" /> Upcoming appointments</h4>{patientSummary.upcomingAppointments.length ? <div className="space-y-2">{patientSummary.upcomingAppointments.map((appointment) => <div key={appointment.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><Clock3 size={14} className="text-teal" /><span className="flex-1 text-xs text-slate-600">{appointment.date} · {appointment.time}</span><span className="text-[10px] text-slate-400">{appointment.doctorName}</span></div>)}</div> : <p className="text-xs text-slate-500">No upcoming appointments.</p>}</div><p className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-800">{patientSummary.disclaimer}</p></div></>}</article>
      </section>
    </div>
  )
}

export default Intelligence
