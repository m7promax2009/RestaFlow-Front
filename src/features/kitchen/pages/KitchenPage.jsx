// Oshxona ekrani (KDS) — yangi va tayyorlanayotgan buyurtmalar ustunlarda.
// Oshpaz "Tayyorlashni boshlash" / "Tayyor" tugmalari orqali holatni suradi.
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChefHat, Clock, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'

import { getOrders, updateOrderStatus } from '../../orders/api'
import { unwrapList, apiErrorMessage, formatTime } from '../../../lib/api'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../constants/roles'
import { socket } from '../../../services/socket'
import { Button, Card, EmptyState, PageHeader, Skeleton } from '../../../components/ui'

const COLUMNS = [
  {
    status: ORDER_STATUS.NEW,
    title: 'Yangi buyurtmalar',
    action: 'Tayyorlashni boshlash',
    next: ORDER_STATUS.IN_KITCHEN,
    accent: 'border-t-indigo-500',
  },
  {
    status: ORDER_STATUS.IN_KITCHEN,
    title: 'Tayyorlanmoqda',
    action: 'Tayyor',
    next: ORDER_STATUS.READY,
    accent: 'border-t-amber-500',
  },
  {
    status: ORDER_STATUS.READY,
    title: 'Tayyor (ofitsiant olishi kerak)',
    action: null,
    next: null,
    accent: 'border-t-emerald-500',
  },
]

export default function KitchenPage() {
  const queryClient = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: ['orders', 'kitchen'],
    queryFn: async () => unwrapList(await getOrders({ limit: 100 }), 'orders'),
    // Socket uzilib qolsa ham ekran eskirmasin.
    refetchInterval: 20_000,
  })

  // Boshqa ofitsiant/oshpaz holatni o'zgartirsa, ekran darhol yangilansin.
  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['orders'] })
    socket.on('order:statusChanged', refresh)
    socket.on('order:new', refresh)
    return () => {
      socket.off('order:statusChanged', refresh)
      socket.off('order:new', refresh)
    }
  }, [queryClient])

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }) => updateOrderStatus(id, nextStatus),
    onSuccess: (_d, { nextStatus }) => {
      toast.success(`"${ORDER_STATUS_LABELS[nextStatus]}" holatiga o'tkazildi`)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Holat o'zgarmadi")),
  })

  const orders = ordersQuery.data ?? []

  return (
    <div>
      <PageHeader
        title="Oshxona"
        subtitle="Buyurtmalarni tayyorlash jarayoni"
        actions={
          <Button variant="secondary" onClick={() => ordersQuery.refetch()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${ordersQuery.isFetching ? 'animate-spin' : ''}`} />
            Yangilash
          </Button>
        }
      />

      {ordersQuery.isError && (
        <Card className="mb-4">
          <p className="text-sm text-rose-600">
            {apiErrorMessage(ordersQuery.error, 'Buyurtmalarni yuklab bo\'lmadi')}
          </p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((o) => o.status === column.status)
          return (
            <div key={column.status}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {column.title}
                </h2>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {ordersQuery.isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32" />)
                ) : columnOrders.length === 0 ? (
                  <Card className={`border-t-4 ${column.accent}`}>
                    <EmptyState icon={ChefHat} title="Bo'sh" />
                  </Card>
                ) : (
                  columnOrders.map((order) => (
                    <Card key={order._id} className={`border-t-4 ${column.accent}`}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          Stol {order.table?.number ?? '—'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.createdAt)}
                        </span>
                      </div>

                      <ul className="mb-3 space-y-1">
                        {order.items?.map((item, i) => (
                          <li
                            key={`${item.product}-${i}`}
                            className="flex justify-between text-sm text-slate-700 dark:text-slate-300"
                          >
                            <span className="truncate">{item.name}</span>
                            <span className="ml-2 shrink-0 font-bold">×{item.quantity}</span>
                          </li>
                        ))}
                      </ul>

                      {order.notes && (
                        <p className="mb-3 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          Izoh: {order.notes}
                        </p>
                      )}

                      {column.next && (
                        <Button
                          className="w-full"
                          disabled={mutation.isPending}
                          onClick={() => mutation.mutate({ id: order._id, nextStatus: column.next })}
                        >
                          {column.action}
                        </Button>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
