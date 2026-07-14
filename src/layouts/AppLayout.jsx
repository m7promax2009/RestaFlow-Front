// Asosiy layout — sidebar + navbar + kontent.
// Mas'ul: Ziyoddila.
import { Outlet } from 'react-router-dom'
// import Sidebar from '../components/common/Sidebar'
// import Navbar from '../components/common/Navbar'

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* <Sidebar /> */}
      <div className="app-main">
        {/* <Navbar /> */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
