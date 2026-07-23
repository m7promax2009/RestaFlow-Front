import { useSelector } from 'react-redux'

export default function CashierDashboard() {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="dashboard-page">
      <h1>Панель кассира</h1>
      <p>Вы вошли как {user?.name ?? user?.email} (роль: {user?.role}).</p>
    </div>
  )
}
