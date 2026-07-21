import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { ToastProvider } from './components/ui'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastProvider />
    </>
  )
}