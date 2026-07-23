// Marshrutlar (React Router) — barcha sahifalar shu yerda ulanadi.
// Mas'ul: Ziyoddila. Har feature o'z sahifalarini lazy import qiladi.
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../routes/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import { ROLES, ROLE_HOME } from '../constants/roles'

// Sahifalar (har mas'ul o'z feature/pages ichida yaratadi)
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/pages/Register'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPassword'))
const OTPPage = lazy(() => import('../features/auth/pages/OTP'))
const ProfilePage = lazy(() => import('../features/auth/pages/Profile'))
const MenuPage = lazy(() => import('../features/menu/pages/MenuPage'))
const TablesPage = lazy(() => import('../features/tables/pages/TablesPage'))
const AdminDashboard = lazy(() => import('../features/dashboard/pages/AdminDashboard'))
const ManagerDashboard = lazy(() => import('../features/dashboard/pages/ManagerDashboard'))
const WaiterDashboard = lazy(() => import('../features/dashboard/pages/WaiterDashboard'))
const CashierDashboard = lazy(() => import('../features/cashier/pages/CashierDashboard')) // Madina
const KitchenDashboard = lazy(() => import('../features/kitchen/pages/KitchenDashboard')) // Ziyoddila
const GuestMenuPage = lazy(() => import('../features/qr-menu/pages/GuestMenuPage'))
// const OrdersPage = lazy(() => import('../features/orders/pages/OrdersPage'))    // Abdugani

// '/' ga tushib qolgan foydalanuvchini o'z roliga mos panelga yo'naltiradi.
function RoleHomeRedirect() {
  const user = useSelector((state) => state.auth.user)
  return <Navigate to={ROLE_HOME[user?.role] ?? '/login'} replace />
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/otp', element: <OTPPage /> },
    ],
  },
  // Mehmon uchun — login talab qilinmaydi.
  { path: '/guest', element: <GuestMenuPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <RoleHomeRedirect /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/tables', element: <TablesPage /> },
          {
            element: <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MANAGER]} />,
            children: [{ path: '/admin', element: <AdminDashboard /> }],
          },
          {
            element: <ProtectedRoute roles={[ROLES.MANAGER]} />,
            children: [{ path: '/manager', element: <ManagerDashboard /> }],
          },
          {
            element: <ProtectedRoute roles={[ROLES.WAITER, ROLES.ADMIN, ROLES.MANAGER]} />,
            children: [{ path: '/waiter', element: <WaiterDashboard /> }],
          },
          {
            element: <ProtectedRoute roles={[ROLES.CASHIER, ROLES.ADMIN, ROLES.MANAGER]} />,
            children: [{ path: '/cashier', element: <CashierDashboard /> }], // Madina
          },
          {
            element: <ProtectedRoute roles={[ROLES.COOK, ROLES.ADMIN, ROLES.MANAGER]} />,
            children: [{ path: '/kitchen', element: <KitchenDashboard /> }], // Ziyoddila
          },
          // { path: '/orders', element: <OrdersPage /> },  // Abdugani

        ],
      },
    ],
  },
])