import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Clock3,
  HeartPulse, Plus, Stethoscope, Users,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'

const admissions = [
  { day: 'Mon', patients: 32 }, { day: 'Tue', patients: 45 }, { day: 'Wed', patients: 38 },
  { day: 'Thu', patients: 56 }, { day: 'Fri', patients: 48 }, { day: 'Sat', patients: 63 }, { day: 'Sun', patients: 52 },
]

const departments = [
  { name: 'Cardiology', value: 28, color: '#168f91' },
  { name: 'Neurology', value: 22, color: '#416e9a' },
  { name: 'Orthopedics', value: 18, color: '#79b6b0' },
  { name: 'Pediatrics', value: 16, color: '#e6a65d' },
  { name: 'Other', value: 16, color: '#cbd7e1' },
]

const appointmentStats = [
  { status: 'Scheduled', count: 78, color: '#168f91' },
  { status: 'Completed', count: 34, color: '#416e9a' },
  { status: 'Pending', count: 10, color: '#e6a65d' },
  { status: 'Cancelled', count: 4, color: '#d87575' },
]

const patients = [
  { initials: 'EW', name: 'Eleanor Wilson', id: 'PT-1048', condition: 'Hypertension', doctor: 'Dr. Maya Patel', status: 'Stable', tone: 'green' },
  { initials: 'JM', name: 'James Mitchell', id: 'PT-1047', condition: 'Cardiac review', doctor: 'Dr. Arjun Mehta', status: 'Monitoring', tone: 'orange' },
  { initials: 'SP', name: 'Sophia Parker', id: 'PT-1046', condition: 'Migraine', doctor: 'Dr. Liam Chen', status: 'Stable', tone: 'green' },
  { initials: 'OB', name: 'Oliver Brooks', id: 'PT-1045', condition: 'Fracture recovery', doctor: 'Dr. Noah Williams', status: 'Recovering', tone: 'blue' },
]

const appointments = [
  { time: '09:30 AM', name: 'Amelia Cooper', reason: 'Cardiology follow-up', doctor: 'Dr. Maya Patel', color: 'bg-teal' },
  { time: '10:15 AM', name: 'Ethan Morris', reason: 'Neurology consultation', doctor: 'Dr. Liam Chen', color: 'bg-blue-500' },
  { time: '11:00 AM', name: 'Isabella Reed', reason: 'Pediatric checkup', doctor: 'Dr. Ava Johnson', color: 'bg-orange-400' },
]

const activities = [
  { icon: Users, color: 'bg-blue-50 text-blue-600', title: 'New patient registered', detail: 'Grace Turner · 12 minutes ago' },
  { icon: CalendarDays, color: 'bg-teal-50 text-teal-700', title: 'Appointment completed', detail: 'PT-1042 with Dr. Patel · 38 minutes ago' },
  { icon: Stethoscope, color: 'bg-violet-50 text-violet-600', title: 'Doctor availability updated', detail: 'Dr. Noah Williams · 1 hour ago' },
]

const statusClasses = {
  green: 'bg-emerald-50 text-emerald-700',
  orange: 'bg-orange-50 text-orange-700',
  blue: 'bg-blue-50 text-blue-700',
}

function SectionHeading({ title, action }) {
  return <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold text-[#18344e]">{title}</h3>{action}</div>
}

function Dashboard() {
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
  const shortDate = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(new Date())
  const stats = [
    { label: 'Total Patients', value: '2,840', change: '+12.8%', icon: Users, iconStyle: 'bg-blue-50 text-blue-600', up: true },
    { label: 'Available Doctors', value: '48', change: '+4.2%', icon: Stethoscope, iconStyle: 'bg-teal-50 text-teal-700', up: true },
    { label: "Today's Appointments", value: '126', change: '+8.1%', icon: CalendarDays, iconStyle: 'bg-violet-50 text-violet-600', up: true },
    { label: 'Critical Patients', value: '08', change: '-2.4%', icon: HeartPulse, iconStyle: 'bg-rose-50 text-rose-600', up: false },
  ]

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm text-slate-500">{today}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Good morning, Admin <span aria-hidden="true">☀️</span></h2><p className="mt-1 text-sm text-slate-500">Here’s what’s happening at CarePoint today.</p></div>
        <Link to="/patients" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168f91] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#117d7f]"><Plus size={16} /> Add new patient</Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, iconStyle, up }) => (
          <article key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}><Icon size={19} /></div><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}</span></div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-[#18344e]">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-[1.35fr_0.85fr_0.9fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6">
          <SectionHeading title="Patient admission trends" action={<select className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-600 outline-none"><option>This week</option><option>This month</option></select>} />
          <div className="mb-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-[#18344e]">334</span><span className="text-xs text-slate-500">admissions this week</span></div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={admissions} margin={{ top: 14, right: 8, left: -20, bottom: 0 }}>
                <defs><linearGradient id="admissionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#168f91" stopOpacity={0.2} /><stop offset="95%" stopColor="#168f91" stopOpacity={0.01} /></linearGradient></defs>
                <CartesianGrid stroke="#edf1f5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={9} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 24px rgba(22,48,72,.08)' }} />
                <Area type="monotone" dataKey="patients" name="Admissions" stroke="#168f91" strokeWidth={2.5} fill="url(#admissionFill)" activeDot={{ r: 5, fill: '#168f91', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6">
          <SectionHeading title="Patients by department" action={<button className="text-slate-400 hover:text-slate-700" aria-label="More department options">···</button>} />
          <div className="relative h-[190px]">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={departments} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">{departments.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Patients']} contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} /></PieChart></ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xl font-bold text-[#18344e]">2,840</span><span className="text-[10px] text-slate-400">Patients</span></div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">{departments.map((item) => <div key={item.name} className="flex items-center gap-2 text-[10px] text-slate-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}<span className="ml-auto font-semibold text-slate-700">{item.value}%</span></div>)}</div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6">
          <SectionHeading title="Appointment statistics" action={<span className="text-[10px] text-slate-400">Today</span>} />
          <div className="mb-1 flex items-baseline gap-2"><span className="text-2xl font-bold text-[#18344e]">126</span><span className="text-xs text-slate-500">appointments</span></div>
          <div className="h-[190px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={appointmentStats} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="#edf1f5" vertical={false} />
            <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip contentStyle={{ border: '1px solid #e8edf2', borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="count" name="Appointments" radius={[5, 5, 0, 0]}>{appointmentStats.map((item) => <Cell key={item.status} fill={item.color} />)}</Bar>
          </BarChart></ResponsiveContainer></div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(22,48,72,0.04)]">
          <div className="px-5 pt-5 sm:px-6"><SectionHeading title="Recent patients" action={<button className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal hover:text-teal-800">View all <ArrowRight size={13} /></button>} /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><th className="px-5 py-3 sm:px-6">Patient</th><th className="px-4 py-3">Condition</th><th className="px-4 py-3">Assigned doctor</th><th className="px-5 py-3 sm:px-6">Status</th></tr></thead><tbody>{patients.map((patient) => <tr key={patient.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5 sm:px-6"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf3f7] text-[10px] font-bold text-[#416e9a]">{patient.initials}</span><span><span className="block text-xs font-semibold text-slate-700">{patient.name}</span><span className="block text-[10px] text-slate-400">{patient.id}</span></span></div></td><td className="px-4 py-3.5 text-xs text-slate-500">{patient.condition}</td><td className="px-4 py-3.5 text-xs text-slate-500">{patient.doctor}</td><td className="px-5 py-3.5 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses[patient.tone]}`}>{patient.status}</span></td></tr>)}</tbody></table></div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6">
          <SectionHeading title="Upcoming appointments" action={<button className="text-[11px] font-semibold text-teal hover:text-teal-800">View calendar</button>} />
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#f2f8f8] px-3 py-2.5 text-xs font-semibold text-[#18344e]"><CalendarDays size={15} className="text-teal" /> Today, {shortDate} <span className="ml-auto text-[10px] font-medium text-slate-400">126 appointments</span></div>
          <div className="space-y-4">{appointments.map((appointment) => <div key={appointment.name} className="flex gap-3"><div className="w-[62px] shrink-0 pt-0.5 text-[10px] font-semibold text-slate-500">{appointment.time}</div><div className={`w-0.5 shrink-0 rounded-full ${appointment.color}`} /><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{appointment.name}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{appointment.reason}</p><p className="mt-1 text-[10px] text-slate-400">{appointment.doctor}</p></div></div>)}</div>
          <div className="mt-5 border-t border-slate-100 pt-4"><button className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal hover:text-teal">See all appointments</button></div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Recent activity" action={<button className="text-[11px] font-semibold text-teal">View all</button>} /><div className="space-y-4">{activities.map(({ icon: Icon, color, title, detail }) => <div key={title} className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon size={16} /></span><div className="min-w-0"><p className="text-xs font-semibold text-slate-700">{title}</p><p className="mt-1 truncate text-[10px] text-slate-400">{detail}</p></div><ArrowRight size={14} className="ml-auto text-slate-300" /></div>)}</div></article>
        <article className="rounded-2xl border border-orange-100 bg-white p-5 shadow-[0_3px_14px_rgba(22,48,72,0.04)] sm:p-6"><SectionHeading title="Health alerts" action={<span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700">3 need attention</span>} /><div className="space-y-3"><div className="flex gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600"><HeartPulse size={16} /></span><div><p className="text-xs font-semibold text-slate-700">Critical reading recorded</p><p className="mt-1 text-[10px] leading-4 text-slate-500">James Mitchell · Elevated blood pressure requires follow-up.</p></div></div><div className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600"><Clock3 size={16} /></span><div><p className="text-xs font-semibold text-slate-700">Follow-up overdue</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Mia Robinson · Missed scheduled check-in yesterday.</p></div></div><div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400"><Activity size={13} className="text-teal" /> Alert information is for demonstration purposes.</div></div></article>
      </section>
    </div>
  )
}

export default Dashboard
