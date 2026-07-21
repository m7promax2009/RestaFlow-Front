// Asosiy layout — sidebar + navbar + kontent.
// Mas'ul: Ziyoddila.
import { NavLink, Outlet } from 'react-router-dom'
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
} from 'react-icons/fi'

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

const currentUser = { name: 'Алексей', fullName: 'Алексей Смирнов', role: 'Администратор', avatar: 68 }

export default function AppLayout() {
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
            <img src={`https://i.pravatar.cc/72?img=${currentUser.avatar}`} alt={currentUser.fullName} />
            <div className="sidebar-profile-text">
              <strong>{currentUser.fullName}</strong>
              <span>{currentUser.role}</span>
            </div>
            <FiChevronDown />
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
