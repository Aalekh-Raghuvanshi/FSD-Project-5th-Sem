import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { AlertCircle, CalendarDays, CheckCircle2, ClipboardList, LoaderCircle, Users } from 'lucide-react'
import { readSettings } from './settings.js'

const chartColors = ['#168f91', '#416e9a', '#79b6b0', '#e6a65d', '#a78bca', '#d87575', '#8ca3b8']
const appointmentColors = { Scheduled: '#168f91', Pending: '#e6a65d', Completed: '#416e9a', Cancelled: '#bdc9d3' }

function getLocalDate(date = new Date()) {
  const local = new Date(date)
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset())
  return local.toISOString().slice(0, 10)
}

function Reports() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [departments, setDepartments] = useState([])
  const [range, setRange] = useState(() => readSettings().reportRange)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadReports() {
    setLoading(true)
    setError('')
    try {
      const [patientResponse, appointmentResponse, departmentResponse] = await Promise.all([
        axios.get('/api/patients'), axios.get('/api/appointments'), axios.get('/api/departments'),
      ])
      setPatients(patientResponse.data)
      setAppointments(appointmentResponse.data)
      setDepartments(departmentResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load reports. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReports() }, [])

  const rangeStart = useMemo(() => {
    if (range === 'all') return ''
    const today = new Date()
    today.setDate(today.getDate() - Number(range) + 1)
    return getLocalDate(today)
  }, [range])
  const today = getLocalDate()

  const filteredPatients = useMemo(() => patients.filter((patient) => (
    (!rangeStart || patient.admissionDate >= rangeStart) && (range === 'all' || patient.admissionDate <= today)
  )), [patients, range, rangeStart, today])
  const filteredAppointments = useMemo(() => appointments.filter((appointment) => (
    (!rangeStart || appointment.date >= rangeStart) && (range === 'all' || appointment.date <= today)
  )), [appointments, range, rangeStart, today])

  const registrationTrend = useMemo(() => {
    const counts = new Map()
    for (const patient of filteredPatients) counts.set(patient.admissionDate, (counts.get(patient.admissionDate) || 0) + 1)
    return [...counts.entries()].sort(([first], [second]) => first.localeCompare(second)).map(([date, count]) => ({
      date,
      label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)),
      patients: count,
    }))
  }, [filteredPatients])

  const departmentStats = useMemo(() => departments.map((department) => ({
    name: department.name,
    patients: filteredPatients.filter((patient) => patient.departmentId === department.id).length,
  })).filter((department) => department.patients > 0), [departments, filteredPatients])

  const appointmentStats = useMemo(() => ['Scheduled', 'Pending', 'Completed', 'Cancelled'].map((status) => ({
    status,
    count: filteredAppointments.filter((appointment) => appointment.status === status).length,
  })), [filteredAppointments])

  const patientStatusStats = useMemo(() => {
    const counts = new Map()
    for (const patient of filteredPatients) counts.set(patient.status, (counts.get(patient.status) || 0) + 1)
    return [...counts.entries()].map(([status, count], index) => ({ status, count, color: chartColors[index % chartColors.length] }))
  }, [filteredPatients])

  const completedCount = filteredAppointments.filter((appointment) => appointment.status === 'Completed').length
  const completionRate = filteredAppointments.length ? Math.round((completedCount / filteredAppointments.length) * 100) : 0
  const criticalPatients = filteredPatients.filter((patient) => patient.status === 'Critical').length
  const periodLabel = range === 'all' ? 'All available records' : `Last ${range} days`

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint insights</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Reports & analytics</h2><p className="mt-1 text-sm text-slate-500">A summary of patient registrations and hospital activity.</p></div><label className="flex items-center gap-2 text-xs font-medium text-slate-500"><CalendarDays size={15} className="text-teal" /><span className="sr-only">Date range</span><select value={range} onChange={(event) => setRange(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All available records</option></select></label></div>

      {error && <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={18} className="shrink-0" /><span className="flex-1">{error}</span><button onClick={loadReports} className="text-xs font-semibold underline">Retry</button></div>}

      {loading ? <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading reports...</div> : !error && <>
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-xs text-slate-500"><span>Report period</span><span className="font-semibold text-slate-700">{periodLabel}</span></div>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Users size={17} /></span><p className="mt-4 text-2xl font-bold text-[#18344e]">{filteredPatients.length}</p><p className="mt-1 text-xs text-slate-500">Patient registrations</p></article>
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><CalendarDays size={17} /></span><p className="mt-4 text-2xl font-bold text-[#18344e]">{filteredAppointments.length}</p><p className="mt-1 text-xs text-slate-500">Appointments in period</p></article>
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={17} /></span><p className="mt-4 text-2xl font-bold text-[#18344e]">{completionRate}%</p><p className="mt-1 text-xs text-slate-500">Appointment completion rate</p></article>
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><ClipboardList size={17} /></span><p className="mt-4 text-2xl font-bold text-[#18344e]">{criticalPatients}</p><p className="mt-1 text-xs text-slate-500">Critical patient records</p></article>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4"><h3 className="text-sm font-bold text-[#18344e]">Patient registration trend</h3><p className="mt-1 text-xs text-slate-500">Registrations by admission date</p></div>{registrationTrend.length ? <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={registrationTrend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="reportPatientsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#168f91" stopOpacity={0.22} /><stop offset="95%" stopColor="#168f91" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#edf1f5" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={8} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} /><Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''} contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Area type="monotone" dataKey="patients" name="Registrations" stroke="#168f91" strokeWidth={2.5} fill="url(#reportPatientsFill)" /></AreaChart></ResponsiveContainer></div> : <div className="flex h-[280px] items-center justify-center text-xs text-slate-400">No registrations in this period.</div>}</article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4"><h3 className="text-sm font-bold text-[#18344e]">Department-wise patients</h3><p className="mt-1 text-xs text-slate-500">Patient records grouped by department</p></div>{departmentStats.length ? <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={departmentStats} layout="vertical" margin={{ top: 2, right: 16, left: 4, bottom: 2 }}><CartesianGrid stroke="#edf1f5" horizontal={false} /><XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} /><YAxis type="category" dataKey="name" width={105} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip cursor={{ fill: '#f7fafb' }} contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Bar dataKey="patients" name="Patients" fill="#168f91" radius={[0, 5, 5, 0]} barSize={18} /></BarChart></ResponsiveContainer></div> : <div className="flex h-[280px] items-center justify-center text-xs text-slate-400">No department records in this period.</div>}</article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4"><h3 className="text-sm font-bold text-[#18344e]">Appointment outcomes</h3><p className="mt-1 text-xs text-slate-500">Status breakdown for selected period</p></div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={appointmentStats} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#edf1f5" vertical={false} /><XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={8} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} /><Tooltip contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Bar dataKey="count" name="Appointments" radius={[5, 5, 0, 0]}>{appointmentStats.map((item) => <Cell key={item.status} fill={appointmentColors[item.status]} />)}</Bar></BarChart></ResponsiveContainer></div></article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-2"><h3 className="text-sm font-bold text-[#18344e]">Patient status distribution</h3><p className="mt-1 text-xs text-slate-500">Current status of patients registered in period</p></div>{patientStatusStats.length ? <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={patientStatusStats} dataKey="count" nameKey="status" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">{patientStatusStats.map((item) => <Cell key={item.status} fill={item.color} />)}</Pie><Tooltip contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#64748b' }} /></PieChart></ResponsiveContainer></div> : <div className="flex h-[280px] items-center justify-center text-xs text-slate-400">No patient status records in this period.</div>}</article>
        </section>
      </>}
    </div>
  )
}

export default Reports
