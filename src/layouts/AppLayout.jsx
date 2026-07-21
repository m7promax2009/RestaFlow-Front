// Asosiy layout — sidebar + navbar + kontent.
// Mas'ul: Ziyoddila.
import { Outlet } from 'react-router-dom'
import { FiHome, FiShoppingCart, FiMenu, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi'
import { useNotificationsSocket } from '../features/notifications'

const navItems = [
  { label: 'Главная', icon: FiHome },
  { label: 'Заказы', icon: FiShoppingCart },
  { label: 'Меню', icon: FiBarChart2 },
  { label: 'Бронь столов', icon: FiUsers },
  { label: 'Персонал', icon: FiUsers },
  { label: 'Клиенты', icon: FiUsers },
  { label: 'Отчёты', icon: FiBarChart2 },
  { label: 'Настройки', icon: FiSettings },
]

export default function AppLayout() {
  useNotificationsSocket()

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">G</div>
          <div>
            <p className="brand-name">Gusto</p>
            <p className="brand-text">Restaurant</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className="sidebar-link" type="button">
              <Icon className="sidebar-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="app-body">
        <header className="app-header">
          <div className="page-title">
            <button className="menu-button" type="button">
              <FiMenu />
            </button>
            <div>
              <h1>Главная</h1>
              <p>Обзор и статистика ресторана</p>
            </div>
          </div>

          <div className="header-actions">
            <label className="search-field">
              <input type="search" placeholder="Поиск..." />
            </label>
            <button className="icon-button" type="button">
              <FiBarChart2 />
            </button>
            <button className="icon-button" type="button">
              <FiShoppingCart />
            </button>
            <div className="profile-chip">
              <span>Алексей</span>
              <div className="profile-badge" />
            </div>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
