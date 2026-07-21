// Marshrutlar (React Router) — barcha sahifalar shu yerda ulanadi.
// Mas'ul: Ziyoddila. Har feature o'z sahifalarini lazy import qiladi.
import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import ProtectedRoute from '../routes/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'

// Sahifalar (har mas'ul o'z feature/pages ichida yaratadi)
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/pages/Register'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPassword'))
const OTPPage = lazy(() => import('../features/auth/pages/OTP'))
const ProfilePage = lazy(() => import('../features/auth/pages/Profile'))
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'))
const MenuPage = lazy(() => import('../features/menu/pages/MenuPage'))
// const TablesPage = lazy(() => import('../features/tables/pages/TablesPage'))    // Abdugani
// const OrdersPage = lazy(() => import('../features/orders/pages/OrdersPage'))    // Abdugani
// const KitchenPage = lazy(() => import('../features/kitchen/pages/KitchenPage')) // Ziyoddila
// const CashierPage = lazy(() => import('../features/cashier/pages/CashierPage')) // Madina

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
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/menu', element: <MenuPage /> },
          // { path: '/tables', element: <TablesPage /> },
          // { path: '/orders', element: <OrdersPage /> },
          // { path: '/kitchen', element: <KitchenPage /> },
          // { path: '/cashier', element: <CashierPage /> },
        ],
      },
    ],
  },
])
