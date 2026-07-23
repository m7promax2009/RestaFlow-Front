// Himoyalangan marshrut — token va rolga qarab kirishni cheklaydi.
// Mas'ul: Ziyoddila (Fayoz bilan auth holati bo'yicha).
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROLE_HOME } from '../constants/roles'

export default function ProtectedRoute({ roles }) {
  const token = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.auth.user)

  // Eski/buzilgan qiymatlarni ("undefined" satri va h.k.) yaroqsiz token sifatida ko'rish
  const isValidToken = token && token !== 'undefined' && token !== 'null'

  if (!isValidToken) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  // Rol tekshiruvi — bu marshrut faqat ma'lum rollarga ochiq bo'lsa
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME[user?.role] ?? '/login'} replace />
  }

  return <Outlet />
}
