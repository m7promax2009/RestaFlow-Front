// Buyurtma "cheki" — real oshxona ticketiga o'xshab teshiklangan yuqori qirra bilan.
// Vaqt o'tishi bilan rang leaf → amber → cherry ga o'zgaradi (shoshilinchlik signali).
// Mas'ul: Ziyodulla & Team.
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ArrowRight, Check, CheckCircle2, MessageSquare, StickyNote } from 'lucide-react'
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
  if (status === ORDER_STATUS.READY) return 'bg-mint/15 text-mint'
  if (minutes < 5) return 'bg-leaf/15 text-leaf'
  if (minutes < 12) return 'bg-amber/20 text-amber-dim dark:text-amber'
  return 'bg-cherry/15 text-cherry'
}

export default function OrderTicket({ order, onStartPreparing, onMarkReady }) {
  const { t } = useTranslation()
  const minutes = useElapsedMinutes(order.createdAt)
  const [checkedItems, setCheckedItems] = useState(new Set())

  const isDelayed = minutes >= 15 && order.status === ORDER_STATUS.NEW

  const toggleCheckItem = (index) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <li
      className={`relative rounded-xl border bg-white shadow-sm transition-all dark:bg-ink-3 ${
        isDelayed
          ? 'border-rose-500 ring-2 ring-rose-400/30 dark:border-rose-500 dark:ring-rose-500/30'
          : 'border-black/10 dark:border-ink-border'
      }`}
    >
      {/* Perforatsiyalangan yuqori qirra — signature element */}
      <div
        aria-hidden="true"
        className="h-3 rounded-t-xl opacity-40"
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
          <div className="mb-2 flex items-center justify-between rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 border border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400 animate-pulse">
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="shrink-0" />
              <span>Kechikmoqda!</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
              15+ daqiqa
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-slate">
              {t('kitchen.ticketNumber', {
                number: order.number ?? String(order.id).slice(-4).toUpperCase(),
              })}
            </p>
            <p className="font-display text-lg text-charcoal dark:text-fog">
              {t('common.table')} {order.table}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-medium ${urgencyClasses(minutes, order.status)}`}
          >
            {minutes < 1
              ? t('kitchen.justNow')
              : t('kitchen.elapsed', { minutes })}
          </span>
        </div>

        {/* Taomlar ro'yxati (Item Check-off) */}
        <ul className="mt-3 space-y-2 border-t border-dashed border-black/10 pt-3 text-sm dark:border-ink-border">
          {order.items?.map((item, index) => {
            const isChecked = checkedItems.has(index)
            const itemNote = item.note || item.comment || item.notes
            return (
              <li
                key={`${item.product}-${index}`}
                onClick={() => toggleCheckItem(index)}
                className="group flex flex-col gap-0.5 text-charcoal dark:text-fog cursor-pointer select-none rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                title="Bajarilganini belgilash uchun bosing"
              >
                <div className="flex items-baseline justify-between gap-2 font-medium">
                  <span className={`flex items-center gap-1.5 transition-all ${isChecked ? 'line-through opacity-50' : ''}`}>
                    {isChecked && <Check size={14} className="text-emerald-500 shrink-0 stroke-[3]" />}
                    <span>{item.product}</span>
                  </span>
                  <span className={`font-mono text-slate shrink-0 transition-opacity ${isChecked ? 'opacity-50' : ''}`}>
                    ×{item.quantity}
                  </span>
                </div>
                {itemNote && (
                  <p
                    className={`mt-0.5 flex items-start gap-1.5 rounded bg-amber-500/10 px-2 py-1 text-xs font-normal text-amber-700 dark:text-amber-300 transition-opacity ${
                      isChecked ? 'opacity-40 line-through' : ''
                    }`}
                  >
                    <MessageSquare size={12} className="mt-0.5 shrink-0 opacity-80" />
                    <span>{itemNote}</span>
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        {order.notes && (
          <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber/10 px-2 py-1.5 text-xs text-amber-dim dark:text-amber">
            <StickyNote size={14} className="mt-0.5 shrink-0" />
            {order.notes}
          </p>
        )}

        {order.waiter && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate">
            <span>
              {t('kitchen.waiter')}: {order.waiter}
            </span>
          </div>
        )}

        {order.status === ORDER_STATUS.NEW && (
          <button
            type="button"
            onClick={() => onStartPreparing(order.id)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-charcoal py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 dark:bg-white/10 dark:hover:bg-white/15"
          >
            {t('kitchen.startPreparing')}
            <ArrowRight size={16} />
          </button>
        )}

        {order.status === ORDER_STATUS.IN_KITCHEN && (
          <button
            type="button"
            onClick={() => onMarkReady(order.id)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-mint py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-mint-dim"
          >
            <CheckCircle2 size={16} />
            {t('kitchen.markReady')}
          </button>
        )}

        {order.status === ORDER_STATUS.READY && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-mint/10 py-2.5 text-sm font-semibold text-mint">
            <CheckCircle2 size={16} />
            {t('kitchen.columns.ready')}
          </div>
        )}
      </div>
    </li>
  )
}
