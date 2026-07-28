// Asosiy layout — sidebar + navbar + kontent.
// Mas'ul: Ziyoddila. (Abdurahmon: rolga qarab sidebar + dark mode + responsive qo'shildi)
import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import steakPhoto from '../assets/steyk.png'
import {
  FiHome,
  FiShoppingCart,
  FiBook,
  FiCalendar,
  FiUsers,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
} from 'react-icons/fi'
import { ROLES, ROLE_LABELS } from '../constants/roles'
import { clearCredentials } from '../features/auth/authSlice'

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/', roles: null },
  { label: 'Buyurtmalar', icon: FiShoppingCart, path: null, roles: null },
  { label: 'Menyu', icon: FiBook, path: '/menu', roles: null },
  { label: 'Bron stollar', icon: FiCalendar, path: '/tables', roles: null },
  {
    label: 'Persona',
    icon: FiUsers,
    path: '/employees',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  { label: 'Mijozlar', icon: FiUser, path: null, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: "Otchyot", icon: FiBarChart2, path: null, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Sozlamalar', icon: FiSettings, path: null, roles: [ROLES.ADMIN] },
]

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return [isDark, setIsDark]
}

export default function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [isDark, setIsDark] = useDarkMode()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const visibleNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  )

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch(clearCredentials())
    navigate('/login')
  }

  return (
    <div className="app-layout flex min-h-screen">
      {/* Mobil uchun orqa fon (drawer ochiq bo'lganda) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar fixed z-40 flex h-full w-64 flex-col transition-transform md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand flex items-center justify-between">
            <p className="brand-name">RestoFlow</p>
            <button
              className="md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Yopish"
            >
              <FiX />
            </button>
          </div>

          <nav className="sidebar-nav">
            {visibleNavItems.map(({ label, icon: Icon, path }) =>
              path ? (
                <NavLink
                  key={label}
                  to={path}
                  end={path === '/'}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="sidebar-icon" />
                  <span>{label}</span>
                </NavLink>
              ) : (
                <button key={label} className="sidebar-link" type="button">
                  <Icon className="sidebar-icon" />
                  <span>{label}</span>
                </button>
              ),
            )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="sidebar-link flex items-center gap-2"
          >
            {isDark ? <FiSun className="sidebar-icon" /> : <FiMoon className="sidebar-icon" />}
            <span>{isDark ? "Yorug' rejim" : "Qorong'i rejim"}</span>
          </button>

          <div className="sidebar-promo">
            <div className="sidebar-promo-image">
              <img src={steakPhoto} alt="Steak with wine" />
            </div>
            <div className="sidebar-promo-text">
              <p className="sidebar-promo-title">Yaratamiz atmosfera</p>
              <p className="sidebar-promo-subtitle">mehmonlaringiz uchun</p>
              <button type="button" className="sidebar-promo-btn">
                Batafsil <span>→</span>
              </button>
            </div>
          </div>

          <div className="sidebar-profile flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex flex-1 items-center gap-2 text-left"
            >
              <img
                src={`https://i.pravatar.cc/72?u=${user?._id ?? 'guest'}`}
                alt={user?.name ?? 'Foydalanuvchi'}
              />
              <div className="sidebar-profile-text">
                <strong>{user?.name ?? 'Foydalanuvchi'}</strong>
                <span>{ROLE_LABELS[user?.role] ?? user?.role}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Chiqish"
              className="text-red-400 hover:text-red-500"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      <div className="app-body flex-1">
        <header className="flex items-center gap-3 border-b p-3 md:hidden">
          <button onClick={() => setIsMobileOpen(true)} aria-label="Menyu">
            <FiMenu size={22} />
          </button>
          <span className="font-semibold">RestoFlow</span>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}