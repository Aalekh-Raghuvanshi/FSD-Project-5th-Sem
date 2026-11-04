import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Activity, AlertCircle, Baby, Bone, Brain, HeartPulse, Hospital,
  LoaderCircle, Search, Sparkles, Stethoscope, Users,
} from 'lucide-react'

const departmentIcons = {
  Cardiology: { icon: HeartPulse, color: 'bg-rose-50 text-rose-600', stripe: 'bg-rose-400' },
  Neurology: { icon: Brain, color: 'bg-violet-50 text-violet-600', stripe: 'bg-violet-400' },
  Orthopedics: { icon: Bone, color: 'bg-blue-50 text-blue-600', stripe: 'bg-blue-400' },
  Pediatrics: { icon: Baby, color: 'bg-amber-50 text-amber-600', stripe: 'bg-amber-400' },
  Dermatology: { icon: Sparkles, color: 'bg-pink-50 text-pink-600', stripe: 'bg-pink-400' },
  'General Medicine': { icon: Stethoscope, color: 'bg-teal-50 text-teal-700', stripe: 'bg-teal-500' },
  Emergency: { icon: Activity, color: 'bg-orange-50 text-orange-600', stripe: 'bg-orange-400' },
}

function Departments() {
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDepartments() {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/departments')
      setDepartments(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load departments. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDepartments() }, [])

  const visibleDepartments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return departments.filter((department) => department.name.toLowerCase().includes(query) || department.description.toLowerCase().includes(query))
  }, [departments, search])

  const totalDoctors = departments.reduce((total, department) => total + department.doctorCount, 0)
  const totalPatients = departments.reduce((total, department) => total + department.patientCount, 0)

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint directory</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Hospital departments</h2><p className="mt-1 text-sm text-slate-500">Explore clinical teams and the patients they care for.</p></div><label className="flex h-11 min-w-[250px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search departments" className="w-full text-xs outline-none placeholder:text-slate-400" /></label></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs text-slate-500"><Hospital size={15} className="text-teal" /> Departments</div><p className="mt-2 text-2xl font-bold text-[#18344e]">{departments.length}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs text-slate-500"><Stethoscope size={15} className="text-blue-600" /> Doctors across departments</div><p className="mt-2 text-2xl font-bold text-[#18344e]">{totalDoctors}</p></div><div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs text-slate-500"><Users size={15} className="text-violet-600" /> Patients under care</div><p className="mt-2 text-2xl font-bold text-[#18344e]">{totalPatients}</p></div></div>

      {error && <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={18} className="shrink-0" /><span className="flex-1">{error}</span><button onClick={loadDepartments} className="text-xs font-semibold underline">Retry</button></div>}

      {loading ? <div className="flex min-h-60 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin text-teal" /> Loading departments...</div> : !error && visibleDepartments.length === 0 ? <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center"><Hospital size={24} className="text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No departments found</p><p className="mt-1 text-xs text-slate-500">Try another search term.</p></div> : !error && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{visibleDepartments.map((department) => { const visual = departmentIcons[department.name] || departmentIcons['General Medicine']; const Icon = visual.icon; return <article key={department.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_3px_14px_rgba(22,48,72,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"><div className={`h-1 ${visual.stripe}`} /><div className="p-5"><div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${visual.color}`}><Icon size={22} /></div><span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400">{department.id}</span></div><h3 className="mt-4 text-base font-bold text-[#18344e]">{department.name}</h3><p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{department.description}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Stethoscope size={15} /></span><div><p className="text-sm font-bold text-slate-700">{department.doctorCount}</p><p className="text-[10px] text-slate-400">Doctors</p></div></div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Users size={15} /></span><div><p className="text-sm font-bold text-slate-700">{department.patientCount}</p><p className="text-[10px] text-slate-400">Patients</p></div></div></div></div></article> })}</div>}
    </div>
  )
}

export default Departments
