// Socket.io ulanishi — real-time buyurtma va bildirishnomalar uchun.
// Mas'ul: Ziyoddila (infra). Foydalanadi: kitchen, orders, notifications.
import { io } from 'socket.io-client'

// Dev'da Vite proxy'si HTTP so'rovlari bilan birga socket'ni ham uzatadi.
const URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? window.location.origin : 'https://backend-production-109c0.up.railway.app')

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
})

// Eventlar (backend bilan kelishilgan):
//   order:new             — yangi buyurtma (oshxona)
//   order:statusChanged   — status o'zgardi
//   order:ready           — tayyor (ofitsiantga)
//   table:status_updated — stol holati (backend kanonik nomi)
//   notification:new      — yangi bildirishnoma
export const connectSocket = (token) => {
  socket.auth = { token }
  socket.connect()
}

export const disconnectSocket = () => socket.disconnect()

if (import.meta.env.DEV) window.__socket = socket // TEMP: demo uchun
