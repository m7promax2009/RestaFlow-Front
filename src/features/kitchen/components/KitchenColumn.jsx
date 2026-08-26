// Bitta ustun (Kutilmoqda / Tayyorlanmoqda / Tayyor).
// Mas'ul: Ziyodulla & Team.
import { useTranslation } from 'react-i18next'
import OrderTicket from './OrderTicket'

const DOT_COLOR = {
  pending: 'bg-leaf',
  preparing: 'bg-amber',
  ready: 'bg-mint',
}

export default function KitchenColumn({ id, orders, onStartPreparing, onMarkReady }) {
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
    <div className="flex w-[85vw] shrink-0 flex-col rounded-2xl bg-paper-2/60 p-3 dark:bg-ink-2 sm:w-full sm:min-w-0">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${DOT_COLOR[id]}`} />
          <h3 className="font-display text-base tracking-wide text-charcoal dark:text-fog">
            {t(`kitchen.columns.${id}`)}
          </h3>
        </div>
        <span className="rounded-full bg-black/5 px-2.5 py-0.5 font-mono text-xs font-medium text-slate dark:bg-white/5 shrink-0">
          {totalOrders} ta buyurtma · {totalDishes} ta taom
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-slate dark:border-ink-border">
          {t(`kitchen.empty.${id}`)}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderTicket
              key={order.id}
              order={order}
              onStartPreparing={onStartPreparing}
              onMarkReady={onMarkReady}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
