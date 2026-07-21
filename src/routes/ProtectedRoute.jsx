// Himoyalangan marshrut — token va rolga qarab kirishni cheklaydi.
// Mas'ul: Ziyoddila (Fayoz bilan auth holati bo'yicha).
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ roles }) {
  const token = localStorage.getItem('accessToken')
  // const { user } = useAuth() // Fayoz: auth slice'dan

  // Eski/buzilgan qiymatlarni ("undefined" satri va h.k.) yaroqsiz token sifatida ko'rish
  const isValidToken = token && token !== 'undefined' && token !== 'null'

  if (!isValidToken) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return <Navigate to="/login" replace />
  }

  // Rol tekshiruvi (kerak bo'lsa):
  // if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />

  return <Outlet />
}
