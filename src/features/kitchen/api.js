// Oshxona API so'rovlari.
import api from '../../services/axios'

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
    items: (o.items ?? []).map((i) => ({
      product: i.name ?? i.product,
      quantity: i.quantity,
      note: i.note || i.comment || i.notes || i.instruction || '',
    })),
  }
}

export async function fetchKitchenOrders() {
  const res = await api.get('/orders', { params: { limit: 100 } })
  const orders = res.data?.data?.orders ?? res.data?.orders ?? res.data?.data ?? []
  return orders.map(normalizeKitchenOrder)
}

// Backend kontrakti: PATCH /orders/{id}/status  body: { "status": "yangi" }
export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/orders/${orderId}/status`, { status })
  return res.data?.data
}
