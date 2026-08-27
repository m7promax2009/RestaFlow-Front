// Bitta ustun (Kutilmoqda / Tayyorlanmoqda / Tayyor).
// Mas'ul: Ziyodulla.
import { useTranslation } from 'react-i18next'
import { ChefHat } from 'lucide-react'
import OrderTicket from './OrderTicket'
import { EmptyState, Skeleton } from '../../../components/ui'

const DOT_COLOR = {
  waiting: 'bg-indigo-500',
  making: 'bg-amber-500',
  complete: 'bg-emerald-500',
}

export default function KitchenColumn({
  id,
  orders,
  isLoading,
  onStartPreparing,
  onMarkReady,
  onToggleItemReady,
}) {
  const { t } = useTranslation()

  const totalOrders = orders.length
  const totalDishes = orders.reduce(
    (sum, order) =>
      sum +
      (order.items?.reduce(
        (itemSum, item) => itemSum + (Number(item.quantity) || 1),
        0,
      ) || 0),
    0,
  )

  return (
    <div className="flex w-[85vw] shrink-0 flex-col rounded-2xl bg-slate-50/70 p-3 dark:bg-slate-900/40 sm:w-full sm:min-w-0">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${DOT_COLOR[id]}`} />
          <h3 className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">
            {t(`kitchen.columns.${id}`)}
          </h3>
        </div>
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
          {totalOrders} ta buyurtma · {totalDishes} ta taom
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-10 dark:border-slate-700">
          <EmptyState icon={ChefHat} title={t(`kitchen.empty.${id}`)} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderTicket
              key={order._id ?? order.id}
              order={order}
              onStartPreparing={onStartPreparing}
              onMarkReady={onMarkReady}
              onToggleItemReady={onToggleItemReady}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
