// Oshxona paneli — Premium Orange brend dizayn sistemasi.
// Real-time Socket.io + 2 daqiqalik zaxira polling.
import { useTranslation } from 'react-i18next'
import { Radio, WifiOff, UtensilsCrossed } from 'lucide-react'
import { useKitchenOrders } from '../hooks/useKitchenOrders'
import KitchenColumn from '../components/KitchenColumn'
import { ORDER_STATUS } from '../../../constants/roles'

const CONNECTION_META = {
  live: {
    icon: Radio,
    badgeClass:
      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    labelKey: 'kitchen.connectionLive',
  },
  connecting: {
    icon: Radio,
    badgeClass:
      'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    labelKey: 'kitchen.connectionLive',
  },
  offline: {
    icon: WifiOff,
    badgeClass:
      'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-500/20 dark:text-red-400',
    labelKey: 'kitchen.connectionOffline',
  },
}

export default function KitchenPage() {
  const { t } = useTranslation()
  const { columns, connection, setStatus, toggleItemReady } = useKitchenOrders()
  const meta = CONNECTION_META[connection] ?? CONNECTION_META.connecting
  const ConnIcon = meta.icon

  const onStartPreparing = (id) => setStatus(id, ORDER_STATUS.IN_KITCHEN)
  const onMarkReady = (id) => setStatus(id, ORDER_STATUS.READY)

  return (
    <div className="min-h-full rounded-3xl bg-[#FFFDF9] p-4 sm:p-6 dark:bg-[#111827] transition-colors">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/25">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-[#111827] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent dark:from-white dark:via-orange-400 dark:to-amber-400">
              {t('kitchen.title')}
            </h2>
            <p className="text-xs font-medium text-[#6B7280] dark:text-gray-400">
              {t('kitchen.subtitle')}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md ${meta.badgeClass}`}
        >
          <ConnIcon size={14} className="animate-pulse" />
          {t(meta.labelKey)}
        </span>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible">
        <KitchenColumn
          id="pending"
          orders={columns.pending}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
          onToggleItemReady={toggleItemReady}
        />
        <KitchenColumn
          id="preparing"
          orders={columns.preparing}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
          onToggleItemReady={toggleItemReady}
        />
        <KitchenColumn
          id="ready"
          orders={columns.ready}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
          onToggleItemReady={toggleItemReady}
        />
      </div>
    </div>
  )
}
