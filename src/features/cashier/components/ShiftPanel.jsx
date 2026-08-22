// Smena boshqaruv paneli — ochish, yopish, Z-Report ko'rish.
// Backend: GET /api/shifts/current, POST /api/shifts/open, POST /api/shifts/close
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  Banknote,
  CheckCircle,
  Clock,
  Lock,
  Unlock,
  Wallet,
} from 'lucide-react'
import { toast } from 'react-toastify'

import { getCurrentShift, openShift, closeShift } from '../api'
import { unwrap, apiErrorMessage, formatSom, formatDateTime } from '../../../lib/api'
import { Button, Card, Input, Skeleton } from '../../../components/ui'
import ZReportModal from './ZReportModal'

export default function ShiftPanel({ onShiftChange }) {
  const queryClient = useQueryClient()
  const [showOpenForm, setShowOpenForm] = useState(false)
  const [showCloseForm, setShowCloseForm] = useState(false)
  const [showZReport, setShowZReport] = useState(false)
  const [openingBalance, setOpeningBalance] = useState('')
  const [closingBalance, setClosingBalance] = useState('')

  // Joriy smena — GET /api/shifts/current
  const shiftQuery = useQuery({
    queryKey: ['shift', 'current'],
    queryFn: async () => {
      try {
        const res = await getCurrentShift()
        return unwrap(res, 'shift')
      } catch (err) {
        // 404 = smena yo'q
        if (err?.response?.status === 404) return null
        throw err
      }
    },
    refetchInterval: 30_000, // 30 sekundda yangilash
  })

  // Smena ochish — POST /api/shifts/open
  const openMutation = useMutation({
    mutationFn: (payload) => openShift(payload),
    onSuccess: (res) => {
      toast.success('Smena muvaffaqiyatli ochildi!')
      setShowOpenForm(false)
      setOpeningBalance('')
      queryClient.invalidateQueries({ queryKey: ['shift', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      onShiftChange?.(unwrap(res, 'shift'))
    },
    onError: (err) => toast.error(apiErrorMessage(err, "Smenani ochib bo'lmadi")),
  })

  // Smena yopish — POST /api/shifts/close
  const closeMutation = useMutation({
    mutationFn: (payload) => closeShift(payload),
    onSuccess: (res) => {
      toast.success('Smena muvaffaqiyatli yopildi!')
      setShowCloseForm(false)
      setClosingBalance('')
      queryClient.invalidateQueries({ queryKey: ['shift', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      onShiftChange?.(null)
      // Z-Reportni ko'rsatish
      setShowZReport(true)
    },
    onError: (err) => toast.error(apiErrorMessage(err, "Smenani yopib bo'lmadi")),
  })

  const shift = shiftQuery.data
  const isOpen = shift && shift.status === 'open'

  const handleOpen = () => {
    const balance = openingBalance ? Number(openingBalance) : 0
    if (openingBalance && (!Number.isFinite(balance) || balance < 0)) {
      toast.error("Boshlang'ich balans manfiy bo'lishi mumkin emas")
      return
    }
    openMutation.mutate({ openingBalance: balance })
  }

  const handleClose = () => {
    const balance = Number(closingBalance)
    if (!Number.isFinite(balance) || balance < 0) {
      toast.error("Yakuniy balans manfiy bo'lishi mumkin emas")
      return
    }
    closeMutation.mutate({ closingBalance: balance })
  }

  // Yuklanmoqda
  if (shiftQuery.isLoading) {
    return (
      <Card className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-32" />
      </Card>
    )
  }

  // Xatolik
  if (shiftQuery.isError) {
    return (
      <Card className="border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Smena ma'lumotini yuklab bo'lmadi
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {apiErrorMessage(shiftQuery.error)}
            </p>
          </div>
          <Button
            variant="secondary"
            className="ml-auto"
            onClick={() => shiftQuery.refetch()}
          >
            Qayta yuklash
          </Button>
        </div>
      </Card>
    )
  }

  // Smena ochilmagan — ochish formasi
  if (!isOpen) {
    return (
      <>
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
              <Lock className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-800 dark:text-amber-200">
                Smena ochilmagan
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Kassa ishlashi uchun avval smenani oching. Smenasiz to'lov qabul qilib bo'lmaydi.
              </p>

              {showOpenForm ? (
                <div className="mt-4 space-y-3">
                  <Input
                    label="Boshlang'ich balans (so'm)"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowOpenForm(false)
                        setOpeningBalance('')
                      }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      isLoading={openMutation.isPending}
                      onClick={handleOpen}
                    >
                      <Unlock className="mr-2 h-4 w-4" /> Smenani ochish
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="mt-3"
                  onClick={() => setShowOpenForm(true)}
                >
                  <Unlock className="mr-2 h-4 w-4" /> Smena ochish
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Yopilgan smena Z-Reportini ko'rish uchun */}
        <ZReportModal
          isOpen={showZReport}
          onClose={() => setShowZReport(false)}
          shiftId={shift?._id}
        />
      </>
    )
  }

  // Smena ochiq — holat ko'rsatish + yopish
  const shiftDuration = shift.openedAt
    ? formatDuration(new Date(shift.openedAt))
    : '—'

  return (
    <>
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
            <Unlock className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                Smena ochiq
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Faol
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <ShiftStat
                icon={Clock}
                label="Ochilgan"
                value={formatDateTime(shift.openedAt)}
              />
              <ShiftStat
                icon={Wallet}
                label="Boshlang'ich"
                value={formatSom(shift.openingBalance)}
              />
              <ShiftStat
                icon={Banknote}
                label="Umumiy tushum"
                value={formatSom(shift.totalIncome ?? 0)}
              />
              <ShiftStat
                icon={Clock}
                label="Davomiylik"
                value={shiftDuration}
              />
            </div>

            {shift.user && (
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Kassir: {shift.user.name ?? shift.user.username ?? '—'}
              </p>
            )}

            {showCloseForm ? (
              <div className="mt-4 space-y-3 border-t border-emerald-200 pt-4 dark:border-emerald-800">
                <Input
                  label="Yakuniy balans (naqd kassada, so'm)"
                  type="number"
                  min={0}
                  placeholder="Kassadagi naqd pulni kiriting"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                />
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Kassadagi haqiqiy naqd pul miqdorini kiriting. Tizim avtomatik ravishda hisob-kitob qiladi.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCloseForm(false)
                      setClosingBalance('')
                    }}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    variant="danger"
                    isLoading={closeMutation.isPending}
                    onClick={handleClose}
                  >
                    <Lock className="mr-2 h-4 w-4" /> Smenani yopish
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => setShowCloseForm(true)}
                >
                  <Lock className="mr-2 h-4 w-4" /> Smenani yopish
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowZReport(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Z-Report
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <ZReportModal
        isOpen={showZReport}
        onClose={() => setShowZReport(false)}
        shiftId={shift?._id}
      />
    </>
  )
}

function ShiftStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">{label}</p>
        <p className="font-semibold text-emerald-800 dark:text-emerald-200">{value}</p>
      </div>
    </div>
  )
}

/** Millisekundlarni soat:dakika ko'rinishiga aylantiradi */
function formatDuration(ms) {
  if (!ms) return '—'
  const diff = Date.now() - new Date(ms).getTime()
  if (diff < 0) return '—'
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  if (hours > 0) return `${hours} soat ${minutes} daqiqa`
  return `${minutes} daqiqa`
}
