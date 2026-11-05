import { useState } from 'react'
import {
  Bell, Building2, CheckCircle2, Info, RotateCcw, Save, SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { defaultSettings, readSettings, settingsStorageKey } from './settings.js'

function SettingsPage() {
  const [settings, setSettings] = useState(readSettings)
  const [saved, setSaved] = useState(false)

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setSettings((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setSaved(false)
  }

  function saveSettings(event) {
    event.preventDefault()
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings))
    setSaved(true)
  }

  function resetSettings() {
    setSettings({ ...defaultSettings })
    localStorage.removeItem(settingsStorageKey)
    setSaved(false)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">CarePoint preferences</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#18344e]">Settings</h2><p className="mt-1 text-sm text-slate-500">Update hospital details, profile information, and dashboard preferences.</p></div><span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400"><Info size={13} /> Saved in this browser</span></div>

      {saved && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 size={17} /> Settings saved successfully.</div>}

      <form onSubmit={saveSettings} className="space-y-5">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Building2 size={19} /></span><div><h3 className="text-sm font-bold text-[#18344e]">Hospital profile</h3><p className="mt-1 text-xs text-slate-500">Contact information shown to staff.</p></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Hospital name<input name="hospitalName" value={settings.hospitalName} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label><label className="text-xs font-semibold text-slate-600">Contact email<input name="hospitalEmail" type="email" value={settings.hospitalEmail} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label><label className="text-xs font-semibold text-slate-600">Phone number<input name="hospitalPhone" type="tel" value={settings.hospitalPhone} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label><label className="text-xs font-semibold text-slate-600">Hospital address<input name="hospitalAddress" value={settings.hospitalAddress} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label></div></section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><UserRound size={19} /></span><div><h3 className="text-sm font-bold text-[#18344e]">Administrator profile</h3><p className="mt-1 text-xs text-slate-500">Basic profile details for the current user.</p></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Full name<input name="adminName" value={settings.adminName} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label><label className="text-xs font-semibold text-slate-600">Email address<input name="adminEmail" type="email" value={settings.adminEmail} onChange={updateField} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal" /></label></div></section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><SlidersHorizontal size={19} /></span><div><h3 className="text-sm font-bold text-[#18344e]">Dashboard preferences</h3><p className="mt-1 text-xs text-slate-500">Choose how information is presented.</p></div></div><div className="space-y-4"><label className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><span><span className="block text-xs font-semibold text-slate-700">Default reports period</span><span className="mt-1 block text-[10px] text-slate-400">Initial range used when opening reports.</span></span><select name="reportRange" value={settings.reportRange} onChange={updateField} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-teal sm:w-48"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All available records</option></select></label><div className="border-t border-slate-100" /><label className="flex cursor-pointer items-center justify-between gap-4"><span><span className="block text-xs font-semibold text-slate-700">Compact tables</span><span className="mt-1 block text-[10px] text-slate-400">Prefer denser rows when reviewing records.</span></span><input type="checkbox" name="compactTables" checked={settings.compactTables} onChange={updateField} className="h-4 w-4 accent-teal" /></label><div className="border-t border-slate-100" /><label className="flex cursor-pointer items-center justify-between gap-4"><span className="flex items-start gap-3"><Bell size={16} className="mt-0.5 text-orange-500" /><span><span className="block text-xs font-semibold text-slate-700">Show health alerts</span><span className="mt-1 block text-[10px] text-slate-400">Display the health alert panel on the dashboard.</span></span></span><input type="checkbox" name="showHealthAlerts" checked={settings.showHealthAlerts} onChange={updateField} className="h-4 w-4 accent-teal" /></label></div></section>

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row"><button type="button" onClick={resetSettings} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"><RotateCcw size={14} /> Restore defaults</button><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#168f91] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#117d7f]"><Save size={15} /> Save settings</button></div>
      </form>
    </div>
  )
}

export default SettingsPage
