import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { socket, connectSocket, disconnectSocket } from '../../../services/socket'
import { fetchKitchenOrders, updateOrderStatus, normalizeKitchenOrder } from '../api'
import { ORDER_STATUS } from '../../../constants/roles'
import { playNotificationSound } from '../../../utils/sound'

const BOARD_STATUSES = [ORDER_STATUS.NEW, ORDER_STATUS.IN_KITCHEN, ORDER_STATUS.READY]

export function useKitchenOrders() {
  const [orders, setOrders] = useState([])
  const [connection, setConnection] = useState('connecting') // connecting | live | offline

  const reloadOrders = useCallback(async () => {
    try {
      const data = await fetchKitchenOrders()
      setOrders(data.filter((o) => BOARD_STATUSES.includes(o.status)))
    } catch (err) {
      console.warn('Failed to fetch kitchen orders:', err)
    }
  }, [])

  const upsertOrder = useCallback((incoming) => {
    const normalized = normalizeKitchenOrder(incoming)
    if (!normalized) return
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === normalized.id)
      if (!BOARD_STATUSES.includes(normalized.status)) {
        return prev.filter((o) => o.id !== normalized.id)
      }
      if (!exists) return [normalized, ...prev]
      return prev.map((o) => (o.id === normalized.id ? { ...o, ...normalized } : o))
    })
  }, [])

  // Boshlang'ich yuklash
  useEffect(() => {
    let cancelled = false

    fetchKitchenOrders()
      .then((data) => {
        if (cancelled) return
        setOrders(data.filter((o) => BOARD_STATUSES.includes(o.status)))
        setConnection('live')
      })
      .catch(() => {
        if (cancelled) return
        setConnection('offline')
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Socket.io real-time ulanish
  useEffect(() => {

    const token = window.localStorage.getItem('accessToken')
    connectSocket(token)

    const handleConnect = () => setConnection('live')
    const handleDisconnect = () => setConnection('offline')
    const handleNewOrder = (order) => {
      playNotificationSound()
      toast.info('🔔 Oshxonaga yangi buyurtma keldi!', { autoClose: 4000 })
      if (order && order.orderId) reloadOrders()
      else upsertOrder(order)
    }
    const handleStatusChanged = (order) => {
      if (order && order.orderId) reloadOrders()
      else upsertOrder(order)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleDisconnect)
    socket.on('order:new', handleNewOrder)
    socket.on('kitchen:new_order', handleNewOrder)
    socket.on('order:statusChanged', handleStatusChanged)
    socket.on('order:status_changed', handleStatusChanged)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleDisconnect)
      socket.off('order:new', handleNewOrder)
      socket.off('kitchen:new_order', reloadOrders)
      socket.off('order:statusChanged', handleStatusChanged)
      socket.off('order:status_changed', handleStatusChanged)
    }
  }, [upsertOrder, reloadOrders])

  const setStatus = useCallback(
    async (orderId, status) => {
      // Optimistik yangilanish — UI darhol javob beradi.
      setOrders((prev) =>
        status === ORDER_STATUS.SERVED
          ? prev.filter((o) => o.id !== orderId)
          : prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      )

      try {
        socket.emit('order:updateStatus', { orderId, status })
        await updateOrderStatus(orderId, status)
      } catch {
        // Xatolik bo'lsa — real holatni qayta yuklash
        await reloadOrders()
      }
    },
    [reloadOrders],
  )

  const columns = {
    pending: orders.filter((o) => o.status === ORDER_STATUS.NEW),
    preparing: orders.filter((o) => o.status === ORDER_STATUS.IN_KITCHEN),
    ready: orders.filter((o) => o.status === ORDER_STATUS.READY),
  }

  return { columns, connection, setStatus }
}
