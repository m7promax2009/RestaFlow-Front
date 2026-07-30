// Oshxona paneli — buyurtmalar Kutilmoqda → Tayyorlanmoqda → Tayyor.
// Socket.io orqali real-time yangilanadi.
// Mas'ul: Ziyodulla.
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, WifiOff, FlaskConical } from 'lucide-react'
import { useKitchenOrders } from '../hooks/useKitchenOrders'
import KitchenColumn from '../components/KitchenColumn'
import { ORDER_STATUS } from '../../../constants/roles'

const CONNECTION_META = {
  live: { icon: Radio, className: 'text-emerald-400', labelKey: 'kitchen.connectionLive' },
  connecting: { icon: Radio, className: 'text-slate-400', labelKey: 'kitchen.connectionLive' },
  offline: { icon: WifiOff, className: 'text-red-400', labelKey: 'kitchen.connectionOffline' },
  demo: { icon: FlaskConical, className: 'text-amber-400', labelKey: 'kitchen.connectionDemo' },
}

export default function KitchenPage() {
  const { t } = useTranslation()
  const { columns, connection, setStatus } = useKitchenOrders()
  const [department, setDepartment] = useState('all')

  const meta = CONNECTION_META[connection] ?? CONNECTION_META.connecting
  const ConnIcon = meta.icon

  const onStartPreparing = (id) => setStatus(id, ORDER_STATUS.IN_KITCHEN)
  const onMarkReady = (id) => setStatus(id, ORDER_STATUS.READY)

  const filterByDept = (list) => {
    if (department === 'all') return list;
    return list.filter(item => {
      if (department === 'bar') return item.items?.some(i => i.name?.toLowerCase().includes('sharbat') || i.name?.toLowerCase().includes('choy') || i.name?.toLowerCase().includes('kofe') || i.name?.toLowerCase().includes('ichimlik'));
      if (department === 'mangal') return item.items?.some(i => i.name?.toLowerCase().includes('kebab') || i.name?.toLowerCase().includes('shashlik') || i.name?.toLowerCase().includes('steik'));
      return true;
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100">
            {t('kitchen.title')}
          </h2>
          <p className="text-xs text-slate-400">{t('kitchen.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDepartment('all')}
              className={`px-3 py-1.5 rounded-lg transition ${department === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setDepartment('kitchen')}
              className={`px-3 py-1.5 rounded-lg transition ${department === 'kitchen' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              🍳 Oshpaz
            </button>
            <button
              onClick={() => setDepartment('bar')}
              className={`px-3 py-1.5 rounded-lg transition ${department === 'bar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              🍹 Bar
            </button>
            <button
              onClick={() => setDepartment('mangal')}
              className={`px-3 py-1.5 rounded-lg transition ${department === 'mangal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              🔥 Mangal
            </button>
          </div>

          <span className={`flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold ${meta.className}`}>
            <ConnIcon size={14} />
            {t(meta.labelKey)}
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        <KitchenColumn
          id="pending"
          orders={filterByDept(columns.pending)}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
        />
        <KitchenColumn
          id="preparing"
          orders={filterByDept(columns.preparing)}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
        />
        <KitchenColumn
          id="ready"
          orders={filterByDept(columns.ready)}
          onStartPreparing={onStartPreparing}
          onMarkReady={onMarkReady}
        />
      </div>
    </div>
  )
}

