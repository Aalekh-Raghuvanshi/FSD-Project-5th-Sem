import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle, ArrowRight, CalendarDays,
  CheckCircle2, HeartPulse, LoaderCircle, Stethoscope, Users,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { readSettings } from './settings.js'

const departmentColors = ['#168f91', '#416e9a', '#79b6b0', '#e6a65d', '#a78bca', '#d87575', '#8ca3b8']
const statusColors = { Scheduled: '#168f91', Pending: '#e6a65d', Completed: '#416e9a', Cancelled: '#bdc9d3' }

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function statusStyle(status) {
  if (status === 'Critical') return 'bg-rose-50 text-rose-700'
  if (status === 'Monitoring' || status === 'Needs Follow-up') return 'bg-orange-50 text-orange-700'
  if (status === 'Recovering') return 'bg-blue-50 text-blue-700'
  return 'bg-emerald-50 text-emerald-700'
}

function SectionHeading({ title, action }) {
  return <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold text-[#18344e]">{title}</h3>{action}</div>
}

function Dashboard() {
  const settings = readSettings()
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [departments, setDepartments] = useState([])
  const [admissionRange, setAdmissionRange] = useState('7')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const today = new Date()
  const todayKey = dateKey(today)

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const [patientResponse, doctorResponse, appointmentResponse, departmentResponse] = await Promise.all([
        axios.get('/api/patients'),
        axios.get('/api/doctors'),
        axios.get('/api/appointments'),
        axios.get('/api/departments'),
      ])
      setPatients(patientResponse.data)
      setDoctors(doctorResponse.data)
      setAppointments(appointmentResponse.data)
      setDepartments(departmentResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load the dashboard. Check that the backend is running on port 5001.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  const admissionTrend = useMemo(() => {
    const days = Number(admissionRange)
    const rows = []
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const day = new Date()
      day.setDate(day.getDate() - offset)
      const key = dateKey(day)
      rows.push({
        date: key,
        label: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(day),
        patients: patients.filter((patient) => patient.admissionDate === key).length,
      })
    }
    return rows
  }, [admissionRange, patients])

  const departmentStats = useMemo(() => departments.map((department, index) => ({
    name: department.name,
    value: department.patientCount,
    color: departmentColors[index % departmentColors.length],
  })).filter((department) => department.value > 0), [departments])

  const appointmentStats = useMemo(() => ['Scheduled', 'Pending', 'Completed', 'Cancelled'].map((status) => ({
    status,
    count: appointments.filter((appointment) => appointment.status === status).length,
    color: statusColors[status],
  })), [appointments])

  const todayAppointments = appointments.filter((appointment) => appointment.date === todayKey)
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.date >= todayKey && ['Scheduled', 'Pending'].includes(appointment.status))
    .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`))
    .slice(0, 4)
  const recentPatients = [...patients]
    .sort((first, second) => second.admissionDate.localeCompare(first.admissionDate))
    .slice(0, 4)
  const recentRegistrations = [...patients]
    .sort((first, second) => second.admissionDate.localeCompare(first.admissionDate))
    .slice(0, 3)

  const stats = [
    { label: 'Total Patients', value: patients.length, note: 'Registered patient records', icon: Users, style: 'bg-blue-50 text-blue-600' },
    { label: 'Available Doctors', value: doctors.filter((doctor) => doctor.availability === 'Available').length, note: `of ${doctors.length} doctors`, icon: Stethoscope, style: 'bg-teal-50 text-teal-700' },
    { label: "Today's Appointments", value: todayAppointments.length, note: 'All appointment statuses', icon: CalendarDays, style: 'bg-violet-50 text-violet-600' },
    { label: 'Critical Patients', value: patients.filter((patient) => patient.status === 'Critical').length, note: 'Marked critical in records', icon: HeartPulse, style: 'bg-rose-50 text-rose-600' },
  ]

  const formattedToday = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today)
  const shortDate = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(today)

  if (loading) {
    return <div className="flex min-h-[55vh] items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle size={19} className="animate-spin text-teal" /> Loading hospital overview...</div>
  }

  if (error) {
    return <div role="alert" className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700"><AlertCircle size={19} /><span className="flex-1">{error}</span><button onClick={loadDashboard} className="text-xs font-semibold underline">Retry</button></div>
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div><p className="text-sm text-slate-500">{formattedToday}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Good morning, {settings.adminName} <span aria-hidden="true">☀️</span></h2><p className="mt-1 text-sm text-slate-500">Here’s what’s happening at {settings.hospitalName} today.</p></div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, note, icon: Icon, style }) => <article key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style}`}><Icon size={19} /></div><p className="mt-4 text-2xl font-bold tracking-tight text-[#18344e]">{value}</p><p className="mt-1 text-xs font-medium text-slate-600">{label}</p><p className="mt-1 text-[10px] text-slate-400">{note}</p></article>)}</section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-[1.35fr_0.85fr_0.9fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Patient admission trends" action={<select value={admissionRange} onChange={(event) => setAdmissionRange(event.target.value)} aria-label="Admission trend period" className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-600 outline-none"><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>} /><div className="mb-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-[#18344e]">{admissionTrend.reduce((sum, day) => sum + day.patients, 0)}</span><span className="text-xs text-slate-500">registrations in selected period</span></div><div className="h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={admissionTrend} margin={{ top: 14, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="admissionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#168f91" stopOpacity={0.2} /><stop offset="95%" stopColor="#168f91" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#edf1f5" vertical={false} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={9} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''} contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Area type="monotone" dataKey="patients" name="Registrations" stroke="#168f91" strokeWidth={2.5} fill="url(#admissionFill)" activeDot={{ r: 5, fill: '#168f91', stroke: 'white', strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div></article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Patients by department" action={<span className="text-[10px] text-slate-400">Live patient records</span>} />{departmentStats.length ? <><div className="relative h-[190px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={departmentStats} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">{departmentStats.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [value, 'Patients']} contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#18344e]">{patients.length}</span><span className="text-[10px] text-slate-400">Patients</span></div></div><div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">{departmentStats.map((item) => <div key={item.name} className="flex items-center gap-2 text-[10px] text-slate-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}<span className="ml-auto font-semibold text-slate-700">{item.value}</span></div>)}</div></> : <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">No department patient records yet.</div>}</article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Appointment statistics" action={<span className="text-[10px] text-slate-400">All records</span>} /><div className="mb-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-[#18344e]">{appointments.length}</span><span className="text-xs text-slate-500">appointments</span></div><div className="h-[190px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={appointmentStats} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}><CartesianGrid stroke="#edf1f5" vertical={false} /><XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} dy={8} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} /><Tooltip contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /><Bar dataKey="count" name="Appointments" radius={[5, 5, 0, 0]}>{appointmentStats.map((item) => <Cell key={item.status} fill={item.color} />)}</Bar></BarChart></ResponsiveContainer></div></article>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(22,48,72,0.04)]"><div className="px-5 pt-5 sm:px-6"><SectionHeading title="Recent patients" action={<Link to="/patients" className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal hover:text-teal-800">View all <ArrowRight size={13} /></Link>} /></div>{recentPatients.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><th className="px-5 py-3 sm:px-6">Patient</th><th className="px-4 py-3">Condition</th><th className="px-4 py-3">Assigned doctor</th><th className="px-5 py-3 sm:px-6">Status</th></tr></thead><tbody>{recentPatients.map((patient) => { const doctor = doctors.find((item) => item.id === patient.doctorId); const initials = patient.fullName.split(' ').map((part) => part[0]).slice(0, 2).join(''); return <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5 sm:px-6"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf3f7] text-[10px] font-bold text-[#416e9a]">{initials}</span><span><span className="block text-xs font-semibold text-slate-700">{patient.fullName}</span><span className="block text-[10px] text-slate-400">{patient.id}</span></span></div></td><td className="px-4 py-3.5 text-xs text-slate-500">{patient.condition}</td><td className="px-4 py-3.5 text-xs text-slate-500">{doctor?.name || 'Unassigned'}</td><td className="px-5 py-3.5 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle(patient.status)}`}>{patient.status}</span></td></tr> })}</tbody></table></div> : <div className="p-8 text-center text-xs text-slate-400">No patient registrations yet.</div>}</article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Upcoming appointments" action={<Link to="/appointments" className="text-[11px] font-semibold text-teal hover:text-teal-800">View schedule</Link>} /><div className="mb-4 flex items-center gap-2 rounded-xl bg-[#f2f8f8] px-3 py-2.5 text-xs font-semibold text-[#18344e]"><CalendarDays size={15} className="text-teal" /> Today, {shortDate}<span className="ml-auto text-[10px] font-medium text-slate-400">{todayAppointments.length} today</span></div>{upcomingAppointments.length ? <div className="space-y-4">{upcomingAppointments.map((appointment) => { const patient = patients.find((item) => item.id === appointment.patientId); const doctor = doctors.find((item) => item.id === appointment.doctorId); const department = departments.find((item) => item.id === appointment.departmentId); return <div key={appointment.id} className="flex gap-3"><div className="w-[72px] shrink-0 pt-0.5 text-[10px] font-semibold text-slate-500">{appointment.date === todayKey ? appointment.time : `${appointment.date.slice(5)}`}</div><div className={`w-0.5 shrink-0 rounded-full ${appointment.status === 'Pending' ? 'bg-orange-400' : 'bg-teal'}`} /><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{patient?.fullName || 'Patient record'}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{appointment.reason} · {department?.name || 'Department'}</p><p className="mt-1 text-[10px] text-slate-400">{doctor?.name || 'Unassigned'} · {appointment.status}</p></div></div> })}</div> : <div className="flex min-h-32 flex-col items-center justify-center text-center"><CheckCircle2 size={22} className="text-emerald-500" /><p className="mt-2 text-xs font-semibold text-slate-700">No upcoming appointments</p><p className="mt-1 text-[10px] text-slate-400">New scheduled visits will appear here.</p></div>}</article>
      </section>

      <section className="grid grid-cols-1 gap-5">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Recent activity" action={<Link to="/patients" className="text-[11px] font-semibold text-teal">Patient directory</Link>} />{recentRegistrations.length ? <div className="space-y-4">{recentRegistrations.map((patient) => <div key={patient.id} className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Users size={16} /></span><div className="min-w-0"><p className="text-xs font-semibold text-slate-700">Patient registered · {patient.fullName}</p><p className="mt-1 truncate text-[10px] text-slate-400">{patient.id} · Admission date {patient.admissionDate}</p></div><ArrowRight size={14} className="ml-auto text-slate-300" /></div>)}</div> : <p className="text-xs text-slate-400">No recent activity.</p>}</article>
      </section>
    </div>
  )
}

export default Dashboard
