// Ilova qobig'i — sidebar (rolga qarab filtrlangan), topbar va kontent.
// Premium Orange brend dizayn sistemasi + Mavzu (Light / Dark) almashtirgich.
import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, LogOut, Menu, User, X, UtensilsCrossed, Sun, Moon } from 'lucide-react'

import { clearCredentials } from '../features/auth/authSlice'
import { clearSession } from '../features/auth/session'
import { navItemsForRole } from '../constants/navigation'
import { ROLE_LABELS } from '../constants/roles'
import { useNotificationsSocket } from '../features/notifications'
import { useAuthSync } from '../hooks/useAuthSync'
import { useSocketStatus } from '../hooks/useSocketStatus'
import { useTheme } from '../hooks/useTheme'
import { disconnectSocket } from '../services/socket'

export default function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isSocketConnected = useSocketStatus()
  const { theme, toggleTheme } = useTheme()

  const user = useSelector((state) => state.auth.user)
  const notifications = useSelector((state) => state.notifications.items)
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const [mobileOpen, setMobileOpen] = useState(false)

  useAuthSync() // tablar aro logout sinxronlash
  useNotificationsSocket() // real-time bildirishnomalar

  const items = useMemo(() => navItemsForRole(user?.role), [user?.role])

  // Sahifa almashganda mobil menyu ochiq qolib ketmasin.
  useEffect(() => setMobileOpen(false), [location.pathname])

  const handleLogout = () => {
    disconnectSocket()
    clearSession()
    dispatch(clearCredentials())
    navigate('/login', { replace: true, state: null })
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0F172A] text-white border-r border-gray-800">
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/30">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Resto<span className="text-[#F97316]">Flow</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="text-gray-400 hover:text-white lg:hidden"
          aria-label="Menyuni yopish"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {items.map(({ key, path, label, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{label}</span>
            {key === 'notifications' && unreadCount > 0 && (
              <span className="ml-auto rounded-full bg-[#F97316] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800/80 p-3">
        <NavLink
          to="/profile"
          className="mb-1.5 flex items-center gap-3 rounded-xl p-2.5 text-sm text-gray-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] text-xs font-bold text-white shadow-sm">
            {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-white">
              {user?.name ?? user?.email ?? 'Foydalanuvchi'}
            </span>
            <span className="block truncate text-xs font-medium text-gray-400">
              {ROLE_LABELS[user?.role] ?? user?.role}
            </span>
          </span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Chiqish
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      {/* Mobil sidebar */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Menyuni yopish"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">{sidebar}</aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#E5E7EB] bg-white/90 px-4 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-[#0B0F17]/90 lg:px-6 transition-colors">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Menyuni ochish"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="truncate text-base font-bold bg-gradient-to-r from-[#111827] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent dark:from-white dark:via-orange-400 dark:to-amber-400">
            {items.find((i) => i.path === location.pathname)?.label ?? 'RestoFlow'}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {/* Mavzu (Light / Dark) almashtirish tugmasi */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-orange-50 hover:text-[#F97316] hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              title={theme === 'dark' ? "Yorqin (oq) rejimga o'tish" : "Tungi (qorong'u) rejimga o'tish"}
              aria-label="Mavzuni almashtirish"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span className="hidden sm:inline">Tungi rejim</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="hidden sm:inline">Yorqin Oq</span>
                </>
              )}
            </button>

            <NavLink
              to="/notifications"
              className="relative rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-orange-500/10 hover:text-[#F97316] dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Bildirishnomalar"
            >
              <span
                title={isSocketConnected ? "Real-time ulangan" : "Real-time uzilgan (qayta ulanmoqda...)"}
                className={`absolute -left-0.5 -top-0.5 inline-block h-2 w-2 rounded-full ${
                  isSocketConnected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#F97316] ring-2 ring-white dark:ring-[#0B0F17] animate-pulse" />
              )}
            </NavLink>
            <NavLink
              to="/profile"
              className="rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-orange-500/10 hover:text-[#F97316] dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Profil"
            >
              <User className="h-5 w-5" />
            </NavLink>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
