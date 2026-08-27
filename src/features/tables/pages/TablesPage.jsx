// Stollar — holat bo'yicha ko'rinish; admin/menejer uchun to'liq CRUD.
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Grid3X3, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'react-toastify'

import { createTable, deleteTable, getTables, updateTable } from '../api'
import { unwrapList, apiErrorMessage } from '../../../lib/api'
import {
  ROLES,
  TABLE_STATUS,
  TABLE_STATUS_LABELS,
  TABLE_STATUS_TONE,
} from '../../../constants/roles'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Select,
  Skeleton,
} from '../../../components/ui'

const EMPTY_FORM = { number: '', capacity: 4, location: '', status: TABLE_STATUS.FREE }

const CARD_STYLES = {
  [TABLE_STATUS.FREE]: 'border-emerald-500/30 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30',
  [TABLE_STATUS.BUSY]: 'border-orange-500/30 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/30',
  [TABLE_STATUS.RESERVED]: 'border-amber-500/30 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30',
}

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

  // Stol taxtasi barcha stollarni birdaniga ko'rsatadi (paginatsiz UI),
  // shu sabab limit'ni katta qilib yuboramiz — GET /api/tables?page=1&limit=100
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
    onSuccess: invalidate,
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

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
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

  const tables = [...(tablesQuery.data ?? [])].sort((a, b) => a.number - b.number)
  const counts = {
    [TABLE_STATUS.FREE]: tables.filter((t) => t.status === TABLE_STATUS.FREE).length,
    [TABLE_STATUS.BUSY]: tables.filter((t) => t.status === TABLE_STATUS.BUSY).length,
    [TABLE_STATUS.RESERVED]: tables.filter((t) => t.status === TABLE_STATUS.RESERVED).length,
  }

  return (
    <div>
      <PageHeader
        title="Stollar"
        subtitle={`Jami ${tables.length} ta · Bo'sh ${counts[TABLE_STATUS.FREE]} · Band ${counts[TABLE_STATUS.BUSY]} · Bron ${counts[TABLE_STATUS.RESERVED]}`}
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Stol qo'shish
            </Button>
          )
        }
      />

      {tablesQuery.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : tablesQuery.isError ? (
        <Card>
          <p className="text-sm text-rose-600">
            {apiErrorMessage(tablesQuery.error, "Stollarni yuklab bo'lmadi")}
          </p>
        </Card>
      ) : tables.length === 0 ? (
        <Card>
          <EmptyState
            icon={Grid3X3}
            title="Stollar yo'q"
            description={
              canManage ? "Birinchi stolni qo'shing." : "Administrator hali stol qo'shmagan."
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tables.map((table) => (
            <Card
              key={table._id}
              className={`border-2 ${CARD_STYLES[table.status] ?? ''} ${
                canCreateOrder ? 'cursor-pointer transition hover:shadow-md' : ''
              }`}
              onClick={
                canCreateOrder ? () => navigate(`/waiter?table=${encodeURIComponent(table._id)}`) : undefined
              }
              role={canCreateOrder ? 'button' : undefined}
              tabIndex={canCreateOrder ? 0 : undefined}
              onKeyDown={(event) => {
                if (canCreateOrder && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  navigate(`/waiter?table=${encodeURIComponent(table._id)}`)
                }
              }}
              aria-label={canCreateOrder ? `Stol ${table.number} uchun buyurtma olish` : undefined}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {table.number}
                </span>
                <Badge variant={TABLE_STATUS_TONE[table.status]}>
                  {TABLE_STATUS_LABELS[table.status] ?? table.status}
                </Badge>
              </div>

              <p className="mt-2 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                <Users className="h-3 w-3" /> {table.capacity} kishilik
              </p>
              {table.location && (
                <p className="mt-0.5 truncate text-xs text-slate-500">{table.location}</p>
              )}

              {canManage && (
                <div className="mt-3 space-y-2" onClick={(event) => event.stopPropagation()}>
                  <Select
                    value={table.status}
                    onChange={(e) => statusMutation.mutate({ id: table._id, status: e.target.value })}
                    options={Object.values(TABLE_STATUS).map((s) => ({
                      value: s,
                      label: TABLE_STATUS_LABELS[s],
                    }))}
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" className="flex-1" onClick={() => openEdit(table)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setDeleteConfirm(table)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? `Stol ${editing.number}` : 'Yangi stol'}
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
        <div className="space-y-3">
          <Input
            label="Stol raqami"
            type="number"
            min={1}
            value={form.number}
            onChange={setField('number')}
          />
          <Input
            label="Sig'imi (necha kishilik)"
            type="number"
            min={1}
            value={form.capacity}
            onChange={setField('capacity')}
          />
          <Input
            label="Joylashuvi (ixtiyoriy)"
            value={form.location}
            onChange={setField('location')}
            placeholder="Asosiy zal / Terassa"
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
