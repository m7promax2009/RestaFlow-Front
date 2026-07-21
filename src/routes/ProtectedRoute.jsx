// Himoyalangan marshrut — token va rolga qarab kirishni cheklaydi.
// Mas'ul: Ziyoddila (Fayoz bilan auth holati bo'yicha).
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ roles }) {
  const location = useLocation()
  const token = localStorage.getItem('accessToken')
  const isValidToken = token && token !== 'undefined' && token !== 'null'

  if (!isValidToken) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Rol tekshiruvi (kerak bo'lsa):
  // if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return <Outlet />
}