// Oshxona API so'rovlari va ma'lumotlarni normallashtirish.
import api from '../../services/axios.js'
import { ORDER_STATUS } from '../../constants/roles.js'

export function normalizeKitchenOrder(o) {
  if (!o) return null
  const id = o._id || o.id || o.orderId
  return {
    id,
    number: o.number ?? (id ? `ORD-${String(id).slice(-4).toUpperCase()}` : 'ORD-????'),
    table: typeof o.table === 'object' ? (o.table?.number ?? '—') : (o.table ?? '—'),
    waiter: typeof o.waiter === 'object' ? (o.waiter?.name ?? '—') : (o.waiter ?? '—'),
    status: o.status,
    createdAt: o.createdAt || new Date().toISOString(),
    notes: o.notes || o.note || '',
    items: (o.items ?? []).map((i, index) => ({
      id: i._id || i.id || String(index),
      product: i.name ?? i.product ?? 'Taom',
      quantity: i.quantity ?? 1,
      note: i.note || i.comment || i.notes || i.instruction || '',
      isReady: Boolean(
        i.isReady ||
          i.isDone ||
          i.ready ||
          i.status === 'ready' ||
          i.status === 'tayyor' ||
          i.status === ORDER_STATUS.READY,
      ),
    })),
  }
}

export async function fetchKitchenOrders() {
  const statusFilter = [ORDER_STATUS.NEW, ORDER_STATUS.IN_KITCHEN, ORDER_STATUS.READY].join(',')
  const res = await api.get('/orders', { params: { status: statusFilter, limit: 100 } })
  const orders = res.data?.data?.orders ?? res.data?.orders ?? res.data?.data ?? []
  return orders.map(normalizeKitchenOrder).filter(Boolean)
}

// Backend kontrakti: PATCH /orders/{id}/status  body: { "status": "yangi" }
export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/orders/${orderId}/status`, { status })
  return res.data?.data
}

// Taom check-off uchun: PATCH /orders/{orderId}/items/{itemId} body: { isReady }
export async function updateOrderItemStatus(orderId, itemIndexOrId, isReady) {
  try {
    const res = await api.patch(`/orders/${orderId}/items/${itemIndexOrId}`, { isReady })
    return res.data?.data
  } catch {
    const res = await api.patch(`/orders/${orderId}`, { itemStatus: { itemIndexOrId, isReady } })
    return res.data?.data
  }
}

