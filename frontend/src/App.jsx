import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import Appointments from './Appointments.jsx'
import Departments from './Departments.jsx'
import Doctors from './Doctors.jsx'
import Patients from './Patients.jsx'
import Intelligence from './Intelligence.jsx'
import Reports from './Reports.jsx'
import { readSettings } from './settings.js'
import SettingsPage from './SettingsPage.jsx'
import {
  Activity, Bell, CalendarDays, ChevronDown, ClipboardList, HeartPulse, LayoutDashboard,
  Menu, Search, Settings, ShieldAlert, Stethoscope, Users, X, Building2,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Patients', path: '/patients', icon: Users },
  { label: 'Doctors', path: '/doctors', icon: Stethoscope },
  { label: 'Appointments', path: '/appointments', icon: CalendarDays },
  { label: 'Departments', path: '/departments', icon: Building2 },
  { label: 'Patient Intelligence', path: '/intelligence', icon: HeartPulse },
  { label: 'Reports', path: '/reports', icon: ClipboardList },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar({ closeMenu }) {
  const hospitalSettings = readSettings()
  return (
    <aside className="flex h-full w-[258px] shrink-0 flex-col bg-[#142d46] px-4 py-6 text-white">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[17px] font-bold tracking-tight">CarePoint</div>
          <div className="max-w-[180px] truncate text-[10px] text-slate-400">{hospitalSettings.hospitalName}</div>
        </div>
      </div>

      <div className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Main menu</div>
      <nav className="space-y-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={closeMenu}
            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${isActive ? 'bg-[#1e9d9a] text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><ShieldAlert size={16} className="text-teal-300" /> Need help?</div>
        <p className="text-xs leading-5 text-slate-300">Contact the hospital support team for assistance.</p>
        <button className="mt-3 text-xs font-semibold text-teal-300 hover:text-white">Contact support <span aria-hidden="true">→</span></button>
      </div>
      <div className="mt-4 border-t border-white/10 px-2 pt-4 text-[11px] text-slate-500">CarePoint · Student Project</div>
    </aside>
  )
}

function Topbar({ title, onMenu }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const userSettings = readSettings()
  const initials = userSettings.adminName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const date = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())

  return (
    <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
        <div className="min-w-0">
          <div className="hidden text-[11px] text-slate-400 sm:block">CarePoint <span className="px-1">/</span> <span className="text-slate-500">{title}</span></div>
          <h1 className="truncate text-lg font-bold text-[#18344e]">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <label className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-teal md:flex">
          <Search size={16} className="text-slate-400" />
          <input className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" placeholder="Search anything..." aria-label="Search" />
          <kbd className="rounded border border-slate-200 bg-white px-1 text-[10px] text-slate-400">⌘K</kbd>
        </label>
        <span className="hidden text-xs text-slate-500 xl:block">{date}</span>
        <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-navy" aria-label="Notifications">
          <Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-400" />
        </button>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50" aria-expanded={profileOpen}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9eeec] text-xs font-bold text-[#147b79]">{initials}</span>
            <span className="hidden text-left sm:block"><span className="block text-xs font-semibold text-slate-700">{userSettings.adminName}</span><span className="block text-[10px] text-slate-400">Administrator</span></span>
            <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
          </button>
          {profileOpen && <div className="absolute right-0 top-12 w-44 rounded-xl border border-slate-100 bg-white p-2 shadow-lg"><button onClick={() => setProfileOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">My profile</button><button onClick={() => setProfileOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">Account settings</button></div>}
        </div>
      </div>
    </header>
  )
}

function PlaceholderPage({ page }) {
  const Icon = page.icon
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-sm text-slate-500">Welcome back, Admin</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">{page.heading}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{page.description}</p>
      </div>
      <section className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5f4] text-teal"><Icon size={26} /></div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">{page.label} workspace</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">This section is ready for its features. It will be built in its planned project step.</p>
      </section>
    </div>
  )
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const page = navigation.find((item) => item.path === location.pathname) || navigation[0]
  const descriptions = {
    Patients: 'Manage patient registrations, profiles, and care information.',
    Doctors: 'View and manage the hospital medical team.',
    Appointments: 'Coordinate patient visits and appointment schedules.',
    Departments: 'Explore hospital departments and their care teams.',
    'Patient Intelligence': 'Review explainable patient risk signals and health alerts.',
    Reports: 'Explore hospital activity and performance summaries.',
    Settings: 'Manage hospital profile and application preferences.',
  }
  const content = page.path === '/'
    ? <Dashboard />
    : page.path === '/patients'
      ? <Patients />
      : page.path === '/doctors'
        ? <Doctors />
        : page.path === '/appointments'
          ? <Appointments />
          : page.path === '/departments'
            ? <Departments />
            : page.path === '/intelligence'
              ? <Intelligence />
              : page.path === '/reports'
                ? <Reports />
                : page.path === '/settings'
                  ? <SettingsPage />
                  : <PlaceholderPage page={{ ...page, heading: page.label, description: descriptions[page.label] }} />

  return (
    <div className="min-h-screen bg-[#f4f8fb] lg:flex">
      <div className="hidden lg:block"><Sidebar /></div>
      {mobileMenuOpen && <div className="fixed inset-0 z-40 lg:hidden"><button onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/40" aria-label="Close navigation" /><div className="relative h-full w-[280px]"><button onClick={() => setMobileMenuOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white hover:bg-white/10" aria-label="Close menu"><X size={18} /></button><Sidebar closeMenu={() => setMobileMenuOpen(false)} /></div></div>}
      <div className="min-w-0 flex-1">
        <Topbar title={page.label} onMenu={() => setMobileMenuOpen(true)} />
        <main className={`px-5 py-7 md:px-8 md:py-9 ${readSettings().compactTables ? 'compact-table' : ''}`}>{content}</main>
      </div>
    </div>
  )
}

function App() {
  return <BrowserRouter><Routes><Route path="*" element={<AppLayout />} /></Routes></BrowserRouter>
}

export default App
