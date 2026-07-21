import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { ToastProvider } from './components/ui'
import { connectSocket } from './services/socket'

export default function App() {
  // Sahifa qayta yuklanganda (F5) token localStorage'da qolgan bo'lsa,
  // socket ham qayta ulanishi kerak — aks holda bildirishnomalar tarixi
  // ko'rinadi-yu, lekin yangi real-time xabarlar kelmay qoladi.
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) connectSocket(token)
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <ToastProvider />
    </>
  )
}