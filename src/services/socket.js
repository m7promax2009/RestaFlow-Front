// Socket.io ulanishi — real-time buyurtma va bildirishnomalar uchun.
// Mas'ul: Ziyoddila (infra). Foydalanadi: kitchen, orders, notifications.
import { io } from 'socket.io-client'

const apiUrl = import.meta.env.VITE_API_URL || 'https://backend-production-109c0.up.railway.app/api'
const defaultSocketUrl = apiUrl.replace(/\/api\/?$/, '')
const URL = import.meta.env.VITE_SOCKET_URL || defaultSocketUrl

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})

// Eventlar (backend bilan kelishilgan):
//   order:new             — yangi buyurtma (oshxona)
//   order:statusChanged   — status o'zgardi
//   order:ready           — tayyor (ofitsiantga)
//   table:updated         — stol holati
//   notification:new      — yangi bildirishnoma
export const connectSocket = (token) => {
  socket.auth = { token }
  socket.connect()
}

export const disconnectSocket = () => socket.disconnect()

if (import.meta.env.DEV) window.__socket = socket // TEMP: demo uchun
