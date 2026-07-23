import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthSync } from './hooks/useAuthSync'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './app/router'
import { ToastProvider } from './components/ui'
import { connectSocket } from './services/socket'

export default function App() {
  useAuthSync() // Abdurahmon — tablar aro auth holatini sinxronlash

  // Sahifa qayta yuklanganda (F5) token localStorage'da qolgan bo'lsa,
  // socket ham qayta ulanishi kerak — aks holda bildirishnomalar tarixi
  // ko'rinadi-yu, lekin yangi real-time xabarlar kelmay qoladi (Behruz).
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) connectSocket(token)
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
      <ToastProvider />
    </>
  )
}