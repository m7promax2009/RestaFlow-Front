// Stollar — holat bo'yicha ko'rinish; admin/menejer uchun to'liq CRUD, ofitsiant uchun buyurtma berish.
import { useState, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Crown,
  Grid3X3,
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { toast } from 'react-toastify'

import { createTable, deleteTable, getTables, updateTable } from '../api'
import { unwrapList, apiErrorMessage } from '../../../lib/api'
import {
  ROLES,
  TABLE_STATUS,
  TABLE_STATUS_LABELS,
} from '../../../constants/roles'
import {
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Skeleton,
} from '../../../components/ui'
import TableCard from '../components/TableCard'

const EMPTY_FORM = { number: '', capacity: 4, location: '', status: TABLE_STATUS.FREE }

const isVipTable = (table) => Boolean(table.location && /vip/i.test(table.location))

export default function TablesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const role = useSelector((state) => state.auth.user?.role)
  const canManage = [ROLES.ADMIN, ROLES.MANAGER].includes(role)
  const canCreateOrder = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER].includes(role)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Zone Tabs & Filters & Views
  const [selectedZone, setSelectedZone] = useState('MAIN') // 'MAIN' (Asosiy zal) | 'VIP' (VIP xona)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | FREE | BUSY | RESERVED
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const tablesQuery = useQuery({
    queryKey: ['tables'],
    queryFn: async () => unwrapList(await getTables({ page: 1, limit: 100 }), 'tables'),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tables'] })

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        number: Number(form.number),
        capacity: Number(form.capacity),
        ...(form.location.trim() ? { location: form.location.trim() } : {}),
        ...(editing ? { status: form.status } : {}),
      }
      return editing ? updateTable(editing._id, payload) : createTable(payload)
    },
    onSuccess: () => {
      toast.success(editing ? 'Stol yangilandi' : "Stol qo'shildi")
      closeModal()
      invalidate()
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Stolni saqlab bo'lmadi")),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTable(id, { status }),
    onSuccess: () => {
      toast.success("Stol holati o'zgartirildi")
      invalidate()
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Holat o'zgarmadi")),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTable(id),
    onMutate: async (id) => {
      setDeleteConfirm(null)
      queryClient.setQueryData(['tables'], (old) => {
        if (!Array.isArray(old)) return old
        return old.filter((t) => t._id !== id)
      })
    },
    onSuccess: () => {
      toast.success("Stol o'chirildi")
      invalidate()
    },
    onError: (error) => toast.error(apiErrorMessage(error, "O'chirib bo'lmadi")),
  })

  // Seed default 22 standard tables + 22 VIP tables
  const seedMutation = useMutation({
    mutationFn: async () => {
      const presets = [
        // ─── Asosiy zal (22 ta) ──────────────────────────────
        // 2 kishilik - 4 ta
        { number: 1, capacity: 2, location: 'Asosiy zal' },
        { number: 2, capacity: 2, location: 'Asosiy zal' },
        { number: 3, capacity: 2, location: 'Asosiy zal' },
        { number: 4, capacity: 2, location: 'Asosiy zal' },
        // 4 kishilik - 8 ta
        { number: 5, capacity: 4, location: 'Asosiy zal' },
        { number: 6, capacity: 4, location: 'Asosiy zal' },
        { number: 7, capacity: 4, location: 'Asosiy zal' },
        { number: 8, capacity: 4, location: 'Asosiy zal' },
        { number: 9, capacity: 4, location: 'Asosiy zal' },
        { number: 10, capacity: 4, location: 'Asosiy zal' },
        { number: 11, capacity: 4, location: 'Asosiy zal' },
        { number: 12, capacity: 4, location: 'Asosiy zal' },
        // 6 kishilik - 7 ta
        { number: 13, capacity: 6, location: 'Asosiy zal' },
        { number: 14, capacity: 6, location: 'Asosiy zal' },
        { number: 15, capacity: 6, location: 'Asosiy zal' },
        { number: 16, capacity: 6, location: 'Asosiy zal' },
        { number: 17, capacity: 6, location: 'Asosiy zal' },
        { number: 18, capacity: 6, location: 'Asosiy zal' },
        { number: 19, capacity: 6, location: 'Asosiy zal' },
        // 10 kishilik - 3 ta
        { number: 20, capacity: 10, location: 'Asosiy zal' },
        { number: 21, capacity: 10, location: 'Asosiy zal' },
        { number: 22, capacity: 10, location: 'Asosiy zal' },

        // ─── VIP xona (22 ta) ────────────────────────────────
        // 2 kishilik - 4 ta
        { number: 23, capacity: 2, location: 'VIP xona (VIP 1)' },
        { number: 24, capacity: 2, location: 'VIP xona (VIP 2)' },
        { number: 25, capacity: 2, location: 'VIP xona (VIP 3)' },
        { number: 26, capacity: 2, location: 'VIP xona (VIP 4)' },
        // 4 kishilik - 8 ta
        { number: 27, capacity: 4, location: 'VIP xona (VIP 5)' },
        { number: 28, capacity: 4, location: 'VIP xona (VIP 6)' },
        { number: 29, capacity: 4, location: 'VIP xona (VIP 7)' },
        { number: 30, capacity: 4, location: 'VIP xona (VIP 8)' },
        { number: 31, capacity: 4, location: 'VIP xona (VIP 9)' },
        { number: 32, capacity: 4, location: 'VIP xona (VIP 10)' },
        { number: 33, capacity: 4, location: 'VIP xona (VIP 11)' },
        { number: 34, capacity: 4, location: 'VIP xona (VIP 12)' },
        // 6 kishilik - 7 ta
        { number: 35, capacity: 6, location: 'VIP xona (VIP 13)' },
        { number: 36, capacity: 6, location: 'VIP xona (VIP 14)' },
        { number: 37, capacity: 6, location: 'VIP xona (VIP 15)' },
        { number: 38, capacity: 6, location: 'VIP xona (VIP 16)' },
        { number: 39, capacity: 6, location: 'VIP xona (VIP 17)' },
        { number: 40, capacity: 6, location: 'VIP xona (VIP 18)' },
        { number: 41, capacity: 6, location: 'VIP xona (VIP 19)' },
        // 10 kishilik - 3 ta
        { number: 42, capacity: 10, location: 'VIP xona (VIP 20)' },
        { number: 43, capacity: 10, location: 'VIP xona (VIP 21)' },
        { number: 44, capacity: 10, location: 'VIP xona (VIP 22)' },
      ]

      const existingMap = new Map((tablesQuery.data ?? []).map((t) => [t.number, t]))
      for (const p of presets) {
        const existing = existingMap.get(p.number)
        if (existing) {
          await updateTable(existing._id, { capacity: p.capacity, location: p.location })
        } else {
          await createTable({
            number: p.number,
            capacity: p.capacity,
            location: p.location,
            status: TABLE_STATUS.FREE,
          })
        }
      }
    },
    onSuccess: () => {
      toast.success("22 ta Asosiy zal va 22 ta VIP stol muvaffaqiyatli yaratildi!")
      invalidate()
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Stollarni shakllantirib bo'lmadi")),
  })

  const openCreate = () => {
    setEditing(null)
    setForm({
      number: '',
      capacity: 4,
      location: selectedZone === 'VIP' ? 'VIP xona' : 'Asosiy zal',
      status: TABLE_STATUS.FREE,
    })
    setModalOpen(true)
  }

  const openEdit = (table) => {
    setEditing(table)
    setForm({
      number: table.number ?? '',
      capacity: table.capacity ?? 4,
      location: table.location ?? '',
      status: table.status ?? TABLE_STATUS.FREE,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const allTables = useMemo(() => {
    const list = [...(tablesQuery.data ?? [])]
    return list.sort((a, b) => a.number - b.number)
  }, [tablesQuery.data])

  // Counts for main vs VIP zones
  const mainZoneTables = useMemo(() => allTables.filter((t) => !isVipTable(t)), [allTables])
  const vipZoneTables = useMemo(() => allTables.filter((t) => isVipTable(t)), [allTables])

  const zoneTables = selectedZone === 'MAIN' ? mainZoneTables : vipZoneTables

  // Overall status counts for currently active zone
  const counts = useMemo(() => {
    return {
      total: zoneTables.length,
      [TABLE_STATUS.FREE]: zoneTables.filter((t) => t.status === TABLE_STATUS.FREE).length,
      [TABLE_STATUS.BUSY]: zoneTables.filter((t) => t.status === TABLE_STATUS.BUSY).length,
      [TABLE_STATUS.RESERVED]: zoneTables.filter((t) => t.status === TABLE_STATUS.RESERVED).length,
    }
  }, [zoneTables])

  // Filtered tables based on search, status filter, and selected zone
  const filteredTables = useMemo(() => {
    return zoneTables.filter((table) => {
      // Status filter
      if (statusFilter !== 'ALL' && table.status !== statusFilter) {
        return false
      }
      // Search query (number or location)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const numMatch = String(table.number).includes(query)
        const locMatch = table.location ? table.location.toLowerCase().includes(query) : false
        return numMatch || locMatch
      }
      return true
    })
  }, [zoneTables, statusFilter, searchQuery])

  const handleOrder = (table) => {
    if (canCreateOrder) {
      navigate(`/waiter?table=${encodeURIComponent(table._id)}`)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Stollar
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {selectedZone === 'MAIN' ? 'Asosiy zal' : 'VIP xona'}: Jami {counts.total} ta · Bo'sh {counts[TABLE_STATUS.FREE]} · Band {counts[TABLE_STATUS.BUSY]} · Bron {counts[TABLE_STATUS.RESERVED]}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Stol raqami bo'yicha qidirish..."
              className="w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-2xs transition focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          {/* Add Table Button */}
          {canManage && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition hover:from-[#EA580C] hover:to-[#C2410C] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Yangi stol qo'shish</span>
            </button>
          )}
        </div>
      </div>

      {/* Zone Switcher Tabs (Asosiy zal vs VIP xona) */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setSelectedZone('MAIN')}
          className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            selectedZone === 'MAIN'
              ? 'bg-[#0F172A] text-white shadow-md dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:text-slate-300'
          }`}
        >
          <Grid3X3 className="h-4 w-4 text-[#F97316]" />
          <span>Asosiy zal</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              selectedZone === 'MAIN'
                ? 'bg-[#F97316] text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {mainZoneTables.length} ta stol
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedZone('VIP')}
          className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            selectedZone === 'VIP'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25'
              : 'border border-amber-200/80 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300'
          }`}
        >
          <Crown className="h-4 w-4 text-amber-400" />
          <span>VIP xona</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              selectedZone === 'VIP'
                ? 'bg-white text-amber-700'
                : 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
            }`}
          >
            {vipZoneTables.length} ta stol
          </span>
        </button>

        {canManage && allTables.length < 44 && (
          <button
            type="button"
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="ml-auto flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/90 px-3.5 py-2 text-xs font-bold text-amber-900 shadow-2xs transition hover:bg-amber-100 active:scale-95 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>{seedMutation.isPending ? "Shakllantirilmoqda..." : "44 ta Stolni to'ldirish (22 Asosiy + 22 VIP)"}</span>
          </button>
        )}
      </div>

      {/* Filter Pills & View Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Barchasi */}
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-[#F97316] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            Barchasi
          </button>

          {/* Bo'sh */}
          <button
            type="button"
            onClick={() => setStatusFilter(TABLE_STATUS.FREE)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              statusFilter === TABLE_STATUS.FREE
                ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-[#F97316] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${statusFilter === TABLE_STATUS.FREE ? 'bg-white' : 'bg-emerald-500'}`} />
            Bo'sh
          </button>

          {/* Band */}
          <button
            type="button"
            onClick={() => setStatusFilter(TABLE_STATUS.BUSY)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              statusFilter === TABLE_STATUS.BUSY
                ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-[#F97316] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${statusFilter === TABLE_STATUS.BUSY ? 'bg-white' : 'bg-rose-500'}`} />
            Band
          </button>

          {/* Bron */}
          <button
            type="button"
            onClick={() => setStatusFilter(TABLE_STATUS.RESERVED)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              statusFilter === TABLE_STATUS.RESERVED
                ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md shadow-orange-500/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-[#F97316] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${statusFilter === TABLE_STATUS.RESERVED ? 'bg-white' : 'bg-amber-500'}`} />
            Bron
          </button>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 text-slate-600 transition ${
              viewMode === 'grid'
                ? 'bg-white font-bold text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Setka ko'rinishi"
            aria-label="Setka ko'rinishi"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-1.5 text-slate-600 transition ${
              viewMode === 'list'
                ? 'bg-white font-bold text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Ro'yxat ko'rinishi"
            aria-label="Ro'yxat ko'rinishi"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {tablesQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : tablesQuery.isError ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-rose-600">
            {apiErrorMessage(tablesQuery.error, "Stollarni yuklab bo'lmadi")}
          </p>
        </Card>
      ) : filteredTables.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={selectedZone === 'VIP' ? Crown : Grid3X3}
            title={
              searchQuery || statusFilter !== 'ALL'
                ? "Mos stollar topilmadi"
                : `${selectedZone === 'VIP' ? 'VIP xona' : 'Asosiy zal'}da stollar yo'q`
            }
            description={
              searchQuery || statusFilter !== 'ALL'
                ? "Qidiruv yoki filtr mezonlariga mos stol topilmadi."
                : canManage
                ? "Tugma orqali stol qo'shing yoki 'Stollarni to'ldirish' tugmasini bosing."
                : "Administrator hali ushbu zonaga stol qo'shmagan."
            }
          />
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View Mode */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTables.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              canManage={canManage}
              canCreateOrder={canCreateOrder}
              onEdit={openEdit}
              onDelete={(t) => setDeleteConfirm(t)}
              onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
              onOrder={handleOrder}
            />
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTables.map((table) => {
              const formattedNum = String(table.number || 0).padStart(2, '0')
              const isVip = isVipTable(table)
              return (
                <div
                  key={table._id}
                  onClick={() => handleOrder(table)}
                  className={`flex flex-wrap items-center justify-between gap-4 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    canCreateOrder ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                      {formattedNum}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Stol #{table.number}
                        </span>
                        {table.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            {isVip ? (
                              <Crown className="h-3 w-3 text-amber-500" />
                            ) : (
                              <MapPin className="h-3 w-3 text-slate-400" />
                            )}
                            {table.location}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="h-3 w-3" />
                        {table.capacity} kishilik
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        table.status === TABLE_STATUS.FREE
                          ? 'bg-[#E8F5E9] text-[#2E7D32] dark:bg-emerald-950/60 dark:text-emerald-300'
                          : table.status === TABLE_STATUS.BUSY
                          ? 'bg-[#FFEBEE] text-[#C62828] dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-[#FFF8E1] text-[#F57F17] dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          table.status === TABLE_STATUS.FREE
                            ? 'bg-emerald-500'
                            : table.status === TABLE_STATUS.BUSY
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      {TABLE_STATUS_LABELS[table.status] || table.status}
                    </span>

                    {/* Manage actions */}
                    {canManage && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(table)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(table)}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Table */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? `Stol ${editing.number} tahrirlash` : 'Yangi stol qo\'shish'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Bekor qilish
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.number || !form.capacity}
              isLoading={saveMutation.isPending}
            >
              Saqlash
            </Button>
          </>
        }
      >
        <div className="space-y-3 py-1">
          <Input
            label="Stol raqami"
            type="number"
            min={1}
            value={form.number}
            onChange={setField('number')}
            placeholder="masalan, 1"
          />
          <Input
            label="Sig'imi (necha kishilik)"
            type="number"
            min={1}
            value={form.capacity}
            onChange={setField('capacity')}
            placeholder="masalan, 4"
          />
          <Input
            label="Joylashuvi / Zona (ixtiyoriy)"
            value={form.location}
            onChange={setField('location')}
            placeholder="Asosiy zal / VIP xona (VIP 1)"
          />
          {editing && (
            <Select
              label="Holat"
              value={form.status}
              onChange={setField('status')}
              options={Object.values(TABLE_STATUS).map((s) => ({
                value: s,
                label: TABLE_STATUS_LABELS[s],
              }))}
            />
          )}
        </div>
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Tasdiqlang"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Bekor qilish
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteConfirm._id)}
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
            Stol {deleteConfirm?.number} ni rostdan ham o'chirib tashlamoqchimisiz?
          </p>
        </div>
      </Modal>
    </div>
  )
}
