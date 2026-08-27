// Buyurtma "cheki" — Premium Orange brend dizayn sistemasi.
// Zulfiqor backend API (PATCH /orders/:id/items/:itemId) va Socket.io real-time bilan to'liq ulangan.
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ArrowRight, Check, CheckCircle2, MessageSquare, StickyNote, User } from 'lucide-react'
import { ORDER_STATUS } from '../../../constants/roles'

function useElapsedMinutes(createdAt) {
  const [minutes, setMinutes] = useState(() =>
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes(Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000))
    }, 15000)
    return () => clearInterval(id)
  }, [createdAt])

  return minutes
}

function urgencyClasses(minutes, status) {
  if (status === ORDER_STATUS.READY)
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
  if (minutes < 5)
    return 'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
  if (minutes < 12)
    return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
  return 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
}

export default function OrderTicket({
  order,
  onStartPreparing,
  onMarkReady,
  onToggleItemReady,
}) {
  const { t } = useTranslation()
  const minutes = useElapsedMinutes(order.createdAt)

  const isDelayed = minutes >= 15 && order.status === ORDER_STATUS.NEW

  const handleItemClick = (item, index) => {
    const targetKey = item.id ?? index
    const nextState = !item.isReady
    onToggleItemReady?.(order.id, targetKey, nextState)
  }

  return (
    <li
      className={`relative rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-200 dark:bg-[#1F2937] ${
        isDelayed
          ? 'border-2 border-red-500 ring-4 ring-red-500/20 bg-red-50/20 dark:bg-red-950/20'
          : 'border border-[#E5E7EB] hover:border-orange-500/30 dark:border-gray-700/80'
      }`}
    >
      {/* Signature perforatsiyalangan yuqori qirra */}
      <div
        aria-hidden="true"
        className="h-3 rounded-t-2xl opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1.5px, transparent 1.6px)',
          backgroundSize: '10px 10px',
          backgroundPosition: '5px 0',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="px-4 pb-4 pt-1">
        {/* Kechikayotgan buyurtma yorlig'i (Urgency Alert) */}
        {isDelayed && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm dark:border-red-800 dark:bg-red-950/60 dark:text-red-400 animate-pulse">
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={15} className="shrink-0" />
              <span>Kechikmoqda!</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-90">
              15+ daqiqa
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-block rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-orange-600 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300">
              {t('kitchen.ticketNumber', {
                number: order.number ?? String(order.id).slice(-4).toUpperCase(),
              })}
            </span>
            <p className="mt-1 font-display text-xl font-bold text-[#111827] dark:text-white">
              {t('common.table')} {order.table}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs font-semibold shadow-sm ${urgencyClasses(minutes, order.status)}`}
          >
            {minutes < 1
              ? t('kitchen.justNow')
              : t('kitchen.elapsed', { minutes })}
          </span>
        </div>

        {/* Taomlar ro'yxati (Item Check-off with backend/socket sync) */}
        <ul className="mt-3.5 space-y-2 border-t border-dashed border-[#E5E7EB] pt-3 text-sm dark:border-gray-700">
          {order.items?.map((item, index) => {
            const isChecked = Boolean(item.isReady)
            const itemNote = item.note || item.comment || item.notes
            return (
              <li
                key={`${item.product}-${index}`}
                onClick={() => handleItemClick(item, index)}
                className="group flex flex-col gap-1 cursor-pointer select-none rounded-xl p-2 transition-all duration-150 border border-transparent hover:border-orange-500/20 hover:bg-orange-500/10 dark:hover:bg-orange-500/20"
                title="Bajarilganini belgilash uchun bosing (barcha oshpazlarda saqlanadi va ko'rinadi)"
              >
                <div className="flex items-baseline justify-between gap-2 font-medium">
                  <span
                    className={`flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'line-through opacity-50 text-[#6B7280] dark:text-gray-400'
                        : 'text-[#111827] dark:text-gray-100 font-semibold'
                    }`}
                  >
                    {isChecked && (
                      <Check size={16} className="text-emerald-500 shrink-0 stroke-[3]" />
                    )}
                    <span>{item.product}</span>
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold shrink-0 transition-opacity ${
                      isChecked ? 'opacity-40 text-[#6B7280]' : 'text-[#F97316]'
                    }`}
                  >
                    ×{item.quantity}
                  </span>
                </div>
                {itemNote && (
                  <p
                    className={`mt-0.5 flex items-start gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300 transition-opacity ${
                      isChecked ? 'opacity-40 line-through' : ''
                    }`}
                  >
                    <MessageSquare size={13} className="mt-0.5 shrink-0 text-amber-600 opacity-90" />
                    <span>{itemNote}</span>
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        {order.notes && (
          <p className="mt-2.5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <StickyNote size={15} className="mt-0.5 shrink-0 text-amber-600" />
            <span>{order.notes}</span>
          </p>
        )}

        {order.waiter && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-gray-400">
            <User size={13} />
            <span>
              {t('kitchen.waiter')}: <strong className="text-[#111827] dark:text-gray-200">{order.waiter}</strong>
            </span>
          </div>
        )}

        {order.status === ORDER_STATUS.NEW && (
          <button
            type="button"
            onClick={() => onStartPreparing(order.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:from-[#EA580C] hover:to-orange-700 active:scale-[0.98]"
          >
            {t('kitchen.startPreparing')}
            <ArrowRight size={16} />
          </button>
        )}

        {order.status === ORDER_STATUS.IN_KITCHEN && (
          <button
            type="button"
            onClick={() => onMarkReady(order.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            {t('kitchen.markReady')}
          </button>
        )}

        {order.status === ORDER_STATUS.READY && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 size={16} />
            {t('kitchen.columns.ready')}
          </div>
        )}
      </div>
    </li>
  )
}
