// Oshxona ekrani (KDS) — Kutilmoqda / Tayyorlanmoqda / Tayyor ustunlari.
// Premium Orange brend dizayn sistemasi.
import { useTranslation } from 'react-i18next'
import { RefreshCw, UtensilsCrossed, Volume2, VolumeX } from 'lucide-react'

import { ORDER_STATUS } from '../../../constants/roles'
import { Button, Card, PageHeader } from '../../../components/ui'
import { apiErrorMessage } from '../../../lib/api'
import { useKitchenOrders } from '../hooks/useKitchenOrders'
import KitchenColumn from '../components/KitchenColumn'
import LanguageSwitcher from '../../../components/common/LanguageSwitcher'

const COLUMN_IDS = ['waiting', 'making', 'complete']

export default function KitchenPage() {
  const { t } = useTranslation()
  const {
    columns,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    setStatus,
    toggleItemReady,
    soundEnabled,
    toggleSound,
    testSound,
  } = useKitchenOrders()

  const onStartPreparing = (id) => setStatus(id, ORDER_STATUS.IN_KITCHEN, 'making')
  const onMarkReady = (id) => setStatus(id, ORDER_STATUS.READY, 'complete')

  return (
    <div className="min-h-full rounded-3xl bg-[#FFFDF9] p-4 sm:p-6 dark:bg-[#111827] transition-colors">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/25">
              <UtensilsCrossed size={20} />
            </div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-[#111827] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent dark:from-white dark:via-orange-400 dark:to-amber-400">
              {t('kitchen.title')}
            </span>
          </div>
        }
        subtitle={t('kitchen.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" onClick={testSound} title={t('testSound')}>
              {t('testSound')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              title={soundEnabled ? t('soundOn') : t('soundOff')}
            >
              {soundEnabled ? (
                <Volume2 className="mr-2 h-4 w-4" />
              ) : (
                <VolumeX className="mr-2 h-4 w-4" />
              )}
              {soundEnabled ? t('soundOn') : t('soundOff')}
            </Button>
            <Button type="button" variant="secondary" onClick={() => refetch()}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>
            <LanguageSwitcher />
          </div>
        }
      />

      {isError && (
        <Card className="mb-4">
          <p className="text-sm text-rose-600">{apiErrorMessage(error, t('kitchen.loadFailed'))}</p>
        </Card>
      )}

      <div className="flex items-start gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:items-start lg:overflow-visible">
        {COLUMN_IDS.map((id) => (
          <KitchenColumn
            key={id}
            id={id}
            orders={columns[id]}
            isLoading={isLoading}
            onStartPreparing={onStartPreparing}
            onMarkReady={onMarkReady}
            onToggleItemReady={toggleItemReady}
          />
        ))}
      </div>
    </div>
  )
}
