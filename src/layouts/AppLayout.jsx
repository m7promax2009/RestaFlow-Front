// Asosiy layout — sidebar + navbar + kontent.
// Mas'ul: Ziyoddila.
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
  FiLogOut,
} from 'react-icons/fi'
import { clearCredentials } from '../features/auth/authSlice'
import { ROLE_LABELS } from '../constants/roles'
import { useNotificationsSocket } from '../features/notifications'
import { useAuthSync } from '../hooks/useAuthSync'

const navItems = [
  { label: 'Дашборд', icon: FiHome, path: '/' },
  { label: 'Заказы', icon: FiShoppingCart },
  { label: 'Меню', icon: FiBook, path: '/menu' },
  { label: 'Бронь столов', icon: FiCalendar },
  { label: 'Персонал', icon: FiUsers },
  { label: 'Клиенты', icon: FiUser },
  { label: 'Отчёты', icon: FiBarChart2 },
  { label: 'Настройки', icon: FiSettings },
]

export default function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  useAuthSync() // Abdurahmon — tablar aro logout sinxronlash (Router ichida)
  useNotificationsSocket() // Behruz — real-time bildirishnoma socketi

  const handleLogout = () => {
    dispatch(clearCredentials())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <p className="brand-name">RestoFlow</p>
          </div>

          <nav className="sidebar-nav">
            {navItems.map(({ label, icon: Icon, path }) =>
              path ? (
                <NavLink
                  key={label}
                  to={path}
                  end={path === '/'}
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
          <div className="sidebar-promo">
            <div className="sidebar-promo-image">
              <img src={steakPhoto} alt="Steak with wine" />
            </div>
            <div className="sidebar-promo-text">
              <p className="sidebar-promo-title">Создаём атмосферу</p>
              <p className="sidebar-promo-subtitle">для ваших гостей</p>
              <button type="button" className="sidebar-promo-btn">
                Подробнее <span>→</span>
              </button>
            </div>
          </div>

          <button type="button" className="sidebar-profile">
            <img src="https://i.pravatar.cc/72?img=68" alt={user?.name ?? user?.email ?? 'Foydalanuvchi'} />
            <div className="sidebar-profile-text">
              <strong>{user?.name ?? user?.email ?? 'Foydalanuvchi'}</strong>
              <span>{ROLE_LABELS[user?.role] ?? user?.role}</span>
            </div>
            <FiChevronDown />
          </button>

          <button type="button" className="sidebar-link" onClick={handleLogout}>
            <FiLogOut className="sidebar-icon" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <div className="app-body">
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
