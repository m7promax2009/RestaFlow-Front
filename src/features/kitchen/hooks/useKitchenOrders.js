// Oshxona buyurtmalari — boshlang'ich yuklash + Socket.io real-time yangilanish.
// Mas'ul: Ziyodulla.
import { useCallback, useEffect, useRef, useState } from 'react'
import { socket, connectSocket, disconnectSocket } from '../../../services/socket'
import { fetchKitchenOrders, updateOrderStatus, normalizeKitchenOrder } from '../api'
import { MOCK_ORDERS } from '../mockData'
import { ORDER_STATUS } from '../../../constants/roles'

const BOARD_STATUSES = [ORDER_STATUS.NEW, ORDER_STATUS.IN_KITCHEN, ORDER_STATUS.READY]

function playAudioAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio playback policy
  }
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState([])
  const [connection, setConnection] = useState('connecting') // connecting | live | offline | demo
  const isDemo = useRef(false)

  const reloadOrders = useCallback(async () => {
    try {
      const data = await fetchKitchenOrders()
      setOrders(data.filter((o) => BOARD_STATUSES.includes(o.status)))
    } catch (err) {
      console.warn('Failed to fetch kitchen orders:', err)
    }
  }, [])

  const upsertOrder = useCallback((incoming, isNew = false) => {
    const normalized = normalizeKitchenOrder(incoming)
    if (!normalized) return
    if (isNew) playAudioAlert()
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
      })
      .catch(() => {
        if (cancelled) return
        isDemo.current = true
        setOrders(MOCK_ORDERS)
        setConnection('demo')
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
      playAudioAlert()
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
    socket.on('order:created', handleNewOrder)
    socket.on('kitchen:new_order', handleNewOrder)
    socket.on('order:statusChanged', handleStatusChanged)
    socket.on('order:status_changed', handleStatusChanged)
    socket.on('order:status_updated', handleStatusChanged)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleDisconnect)
      socket.off('order:new', handleNewOrder)
      socket.off('order:created', handleNewOrder)
      socket.off('kitchen:new_order', handleNewOrder)
      socket.off('order:statusChanged', handleStatusChanged)
      socket.off('order:status_changed', handleStatusChanged)
      socket.off('order:status_updated', handleStatusChanged)
      disconnectSocket()
    }
  }, [upsertOrder, reloadOrders])

  const setStatus = useCallback(
    async (orderId, status) => {
      setOrders((prev) =>
        status === ORDER_STATUS.SERVED
          ? prev.filter((o) => o.id !== orderId)
          : prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      )

      if (isDemo.current) return

      try {
        socket.emit('order:updateStatus', { orderId, status })
        await updateOrderStatus(orderId, status)
      } catch (e) {
        console.error('Order status error:', e)
      }
    },
    [],
  )

  const columns = {
    pending: orders.filter((o) => o.status === ORDER_STATUS.NEW),
    preparing: orders.filter((o) => o.status === ORDER_STATUS.IN_KITCHEN),
    ready: orders.filter((o) => o.status === ORDER_STATUS.READY),
  }

  return { columns, connection, setStatus }
}

