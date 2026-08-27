// Bitta ustun (Kutilmoqda / Tayyorlanmoqda / Tayyor).
// Premium Orange brend dizayn sistemasi.
import { useTranslation } from 'react-i18next'
import { ChefHat } from 'lucide-react'
import OrderTicket from './OrderTicket'
import { EmptyState, Skeleton } from '../../../components/ui'

const DOT_COLOR = {
  waiting: 'bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.6)]',
  making: 'bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.6)]',
  complete: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
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
    <div className="flex w-[85vw] shrink-0 flex-col rounded-3xl bg-white/70 p-4 border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-md dark:bg-[#1F2937]/70 dark:border-gray-800 sm:w-full sm:min-w-0 transition-all">
      <div className="mb-4 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <span className={`size-3 rounded-full ${DOT_COLOR[id]}`} />
          <h3 className="font-display text-base font-bold text-[#111827] dark:text-gray-100">
            {t(`kitchen.columns.${id}`)}
          </h3>
        </div>
        <span className="shrink-0 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 font-mono text-xs font-semibold text-[#F97316] dark:bg-orange-500/20 dark:text-orange-300">
          {totalOrders} ta buyurtma · {totalDishes} ta taom
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] py-10 text-center dark:border-gray-800">
          <EmptyState icon={ChefHat} title={t(`kitchen.empty.${id}`)} />
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
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
