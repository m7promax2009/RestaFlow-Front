import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function PublicRoute() {
  const location = useLocation()
  const { accessToken } = useSelector((state) => state.auth)
  const token = accessToken || localStorage.getItem('accessToken')

  if (token) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
