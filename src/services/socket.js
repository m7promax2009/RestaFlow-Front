// Socket.io ulanishi — real-time buyurtma va bildirishnomalar uchun.
// Mas'ul: Ziyoddila (infra). Foydalanadi: kitchen, orders, notifications.
import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
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
