// Buyurtmalar ro'yxati — filtr, sahifalash, status boshqaruvi va stol almashtirish.
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { AlertTriangle, ArrowRightLeft, ClipboardList, RefreshCw, Trash2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'

import { clearAllOrders, deleteOrder, getOrders, updateOrderStatus, transferOrderTable, cancelOrder } from '../api'
import { getTables } from '../../tables/api'
import { unwrapList, unwrapPagination, apiErrorMessage, formatSom, formatTime } from '../../../lib/api'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_LIST,
  ORDER_STATUS_TONE,
  NEXT_ORDER_STATUS,
  ROLES,
} from '../../../constants/roles'
import { Badge, Button, Card, EmptyState, Input, Modal, PageHeader, Select, Skeleton } from '../../../components/ui'

const PAGE_SIZE = 10

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const role = useSelector((state) => state.auth.user?.role)

  const [status, setStatus] = useState('')
  const [paid, setPaid] = useState('')
  const [page, setPage] = useState(1)
  const [transferOrder, setTransferOrder] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const canTransfer = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER].includes(role)
  const canCancel = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER].includes(role)
  const canDelete = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER].includes(role)

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE }
    if (status) p.status = status
    if (paid) p.paid = paid
    return p
  }, [status, paid, page])

  const ordersQuery = useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const res = await getOrders(params)
      return { orders: unwrapList(res, 'orders'), pagination: unwrapPagination(res) }
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => updateOrderStatus(id, nextStatus),
    onSuccess: (_data, { nextStatus }) => {
      toast.success(`Holat "${ORDER_STATUS_LABELS[nextStatus]}" ga o'zgartirildi`)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Holatni o\'zgartirib bo\'lmadi')),
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => cancelOrder(id, reason),
    onSuccess: () => {
      toast.success('Buyurtma bekor qilindi')
      setCancelTarget(null)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Buyurtmani bekor qilib bo'lmadi")),
  })

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllOrders(),
    onMutate: async () => {
      setClearConfirmOpen(false)
      queryClient.setQueryData(['orders', params], { orders: [], pagination: { page: 1, totalPages: 1, total: 0 } })
    },
    onSuccess: () => {
      toast.success("Barcha buyurtmalar o'chirildi")
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Buyurtmalarni o'chirib bo'lmadi")),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onMutate: async (id) => {
      setDeleteTarget(null)
      queryClient.setQueryData(['orders', params], (old) => {
        if (!old) return old
        return {
          ...old,
          orders: old.orders.filter((o) => o._id !== id),
        }
      })
    },
    onSuccess: () => {
      toast.success("Buyurtma o'chirildi")
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Buyurtmani o'chirib bo'lmadi")),
  })

  const orders = ordersQuery.data?.orders ?? []
  const pagination = ordersQuery.data?.pagination

  const resetFilters = () => {
    setStatus('')
    setPaid('')
    setPage(1)
  }

  return (
    <div>
      <PageHeader
        title="Buyurtmalar"
        subtitle="Barcha buyurtmalar, ularning holati va to'lov ma'lumoti"
        actions={
          <div className="flex items-center gap-2">
            {canDelete && orders.length > 0 && (
              <Button
                variant="danger"
                onClick={() => setClearConfirmOpen(true)}
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Barchasini tozalash
              </Button>
            )}
            <Button variant="secondary" onClick={() => ordersQuery.refetch()}>
              <RefreshCw className={`mr-2 h-4 w-4 ${ordersQuery.isFetching ? 'animate-spin' : ''}`} />
              Yangilash
            </Button>
          </div>
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-44">
            <Select
              label="Holat"
              placeholder="Barchasi"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              options={ORDER_STATUS_LIST.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
            />
          </div>
          <div className="w-44">
            <Select
              label="To'lov"
              placeholder="Barchasi"
              value={paid}
              onChange={(e) => {
                setPaid(e.target.value)
                setPage(1)
              }}
              options={[
                { value: 'true', label: "To'langan" },
                { value: 'false', label: "To'lanmagan" },
              ]}
            />
          </div>
          {(status || paid) && (
            <Button variant="ghost" onClick={resetFilters}>
              Tozalash
            </Button>
          )}
        </div>
      </Card>

      {ordersQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : ordersQuery.isError ? (
        <Card>
          <p className="text-sm text-rose-600">
            {apiErrorMessage(ordersQuery.error, 'Buyurtmalarni yuklab bo\'lmadi')}
          </p>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="Buyurtma topilmadi"
            description="Tanlangan filtrlar bo'yicha buyurtma yo'q."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              canTransfer={canTransfer}
              canCancel={canCancel}
              canDelete={canDelete}
              onAdvance={(nextStatus) =>
                statusMutation.mutate({ id: order._id, nextStatus })
              }
              onTransfer={() => setTransferOrder(order)}
              onCancel={() => setCancelTarget(order)}
              onDelete={() => setDeleteTarget(order)}
              isBusy={statusMutation.isPending}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Oldingi
          </Button>
          <span className="text-sm text-slate-500">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Keyingi
          </Button>
        </div>
      )}

      <TransferTableModal
        order={transferOrder}
        onClose={() => setTransferOrder(null)}
        onDone={() => {
          setTransferOrder(null)
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['tables'] })
        }}
      />

      <CancelOrderModal
        order={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={(reason) => cancelMutation.mutate({ id: cancelTarget._id, reason })}
        isLoading={cancelMutation.isPending}
      />

      {/* Barchasini tozalash modali */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Tasdiqlang"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearConfirmOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="danger"
              isLoading={clearAllMutation.isPending}
              onClick={() => clearAllMutation.mutate()}
            >
              Tasdiqlash
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 py-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Barcha buyurtmalarni rostdan ham o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
          </p>
        </div>
      </Modal>

      {/* Yakka buyurtmani o'chirish modali */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Tasdiqlang"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Bekor qilish
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteTarget._id)}
            >
              O'chirish
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 py-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Stol {deleteTarget?.table?.number ?? '—'} buyurtmasini rostdan ham o'chirib tashlamoqchimisiz?
          </p>
        </div>
      </Modal>
    </div>
  )
}

function OrderRow({ order, onAdvance, onTransfer, onCancel, onDelete, canTransfer, canCancel, canDelete, isBusy }) {
  const next = NEXT_ORDER_STATUS[order.status]
  const paidTotal = order.paidTotal ?? 0
  const isPaid = order.isPaid ?? paidTotal >= order.totalAmount
  const isActive = order.status !== ORDER_STATUS.CLOSED && order.status !== ORDER_STATUS.CANCELLED

  return (
    <Card className="flex flex-wrap items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-white">
            Stol {order.table?.number ?? '—'}
          </span>
          <Badge variant={ORDER_STATUS_TONE[order.status]}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
          <Badge variant={isPaid ? 'success' : 'warning'}>
            {isPaid ? "To'langan" : "To'lanmagan"}
          </Badge>
          <span className="text-xs text-slate-400">{formatTime(order.createdAt)}</span>
        </div>

        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
          {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Ofitsiant: {order.waiter?.name ?? '—'}
          {order.notes ? ` · Izoh: ${order.notes}` : ''}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold text-slate-900 dark:text-white">{formatSom(order.totalAmount)}</p>
        {!isPaid && paidTotal > 0 && (
          <p className="text-xs text-slate-400">To'langan: {formatSom(paidTotal)}</p>
        )}
      </div>

      <div className="flex gap-2">
        {canTransfer && isActive && (
          <Button variant="ghost" onClick={onTransfer} title="Boshqa stolga o'tkazish">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        )}
        {canCancel && isActive && (
          <Button variant="ghost" onClick={onCancel} title="Buyurtmani bekor qilish" className="text-rose-600 hover:text-rose-700">
            <XCircle className="h-4 w-4" />
          </Button>
        )}
        {canDelete && (
          <Button variant="ghost" onClick={onDelete} title="Buyurtmani o'chirish">
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
        )}
        {next && (
          <Button onClick={() => onAdvance(next)} disabled={isBusy}>
            {ORDER_STATUS_LABELS[next]}
          </Button>
        )}
      </div>
    </Card>
  )
}

function TransferTableModal({ order, onClose, onDone }) {
  const [tableId, setTableId] = useState('')

  const tablesQuery = useQuery({
    queryKey: ['tables'],
    queryFn: async () => unwrapList(await getTables(), 'tables'),
    enabled: Boolean(order),
  })

  const mutation = useMutation({
    mutationFn: () => transferOrderTable(order._id, tableId),
    onSuccess: () => {
      toast.success("Buyurtma boshqa stolga o'tkazildi")
      setTableId('')
      onDone()
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Stolni o'zgartirib bo'lmadi")),
  })

  if (!order) return null

  // Joriy stolni ro'yxatdan chiqarib tashlaymiz — o'zini o'ziga ko'chirish mantiqsiz.
  const options = (tablesQuery.data ?? [])
    .filter((t) => t._id !== (order.table?._id ?? order.table))
    .map((t) => ({ value: t._id, label: `Stol ${t.number} (${t.capacity} kishilik)` }))

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Stol ${order.table?.number ?? ''} → boshqa stol`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={!tableId} isLoading={mutation.isPending}>
            O'tkazish
          </Button>
        </>
      }
    >
      <Select
        label="Yangi stol"
        placeholder="Stolni tanlang"
        value={tableId}
        onChange={(e) => setTableId(e.target.value)}
        options={options}
      />
    </Modal>
  )
}

function CancelOrderModal({ order, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = useState('')

  if (!order) return null

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Stol ${order.table?.number ?? ''} buyurtmasini bekor qilish`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Orqaga
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(reason)}
            isLoading={isLoading}
          >
            Ha, bekor qilinsin
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Rostdan ham ushbu buyurtmani bekor qilmoqchimisiz? Stol holati qayta bo'shatiladi.
      </p>
      <Input
        label="Bekor qilish sababi (ixtiyoriy)"
        placeholder="Masalan: mijoz voz kechdi"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  )
}
