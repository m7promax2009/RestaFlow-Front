import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getUsers, createUser, updateUser } from '../api'
import { ROLES, ROLE_LABELS } from '../../../constants/roles'
import { can } from '../../../constants/permissions'
import { Input, Table, Button, Modal } from '../../../components/ui'
import AttendanceTable from '../components/AttendanceTable'
import AuditLogPage from './AuditLogPage'

const newEmployeeSchema = z.object({
    name: z.string().min(2, "Kamida 2 ta belgi"),
    email: z.string().email("Email noto'g'ri"),
    password: z.string().min(6, "Kamida 6 ta belgi"),
    phone: z.string().min(9, "Telefon raqam noto'g'ri"),
    role: z.string().min(1, "Rol tanlanishi shart"),
})

export default function EmployeesPage() {
    const currentUser = useSelector((state) => state.auth.user)
    const canCreate = can(currentUser?.role, 'employees:create')
    const canChangeRole = can(currentUser?.role, 'employees:changeRole')
    const canDelete = can(currentUser?.role, 'employees:delete')

    const [activeTab, setActiveTab] = useState('employees') // 'employees' | 'attendance' | 'audit'
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [page, setPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState(null)
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['users', page],
        queryFn: async () => {
            const res = await getUsers({ page, limit: 20 })
            const payload = res.data.data ?? res.data
            return payload.users ?? payload ?? []
        },
        enabled: activeTab === 'employees',
    })

    const filtered = useMemo(() => {
        if (!data) return []
        return data.filter((u) => {
            const matchesSearch =
                !search ||
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase())
            const matchesRole = !roleFilter || u.role === roleFilter
            return matchesSearch && matchesRole
        })
    }, [data, search, roleFilter])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(newEmployeeSchema) })

    const createUserMutation = useMutation({
        mutationFn: (formData) => createUser(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success("Xodim qo'shildi")
            reset()
            setIsModalOpen(false)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Xodim qo'shishda xatolik")
        },
    })

    const toggleActive = useMutation({
        mutationFn: ({ id, isActive }) => updateUser(id, { isActive: !isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('Holat yangilandi')
            setConfirmAction(null)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Xatolik yuz berdi')
            setConfirmAction(null)
        },
    })

    const changeRole = useMutation({
        mutationFn: ({ id, role }) => updateUser(id, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('Rol yangilandi')
            setConfirmAction(null)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Rolni yangilashda xatolik')
            setConfirmAction(null)
        },
    })

    const columns = [
        { key: 'name', title: 'Ism' },
        { key: 'email', title: 'Email' },
        {
            key: 'role',
            title: 'Rol',
            render: (row) =>
                canChangeRole ? (
                    <select
                        value={row.role}
                        disabled={changeRole.isPending}
                        onChange={(e) =>
                            setConfirmAction({ type: 'role', row, newRole: e.target.value })
                        }
                        className="rounded-md border px-2 py-1 text-xs dark:bg-gray-700 dark:text-white"
                    >
                        {Object.values(ROLES).map((role) => (
                            <option key={role} value={role}>
                                {ROLE_LABELS[role]}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {ROLE_LABELS[row.role] ?? row.role}
                    </span>
                ),
        },
        {
            key: 'isActive',
            title: 'Holat',
            render: (row) => (
                <span className={row.isActive ? 'text-green-600' : 'text-gray-400'}>
                    {row.isActive ? 'Faol' : "Faol emas"}
                </span>
            ),
        },
        {
            key: 'actions',
            title: '',
            render: (row) =>
                canDelete ? (
                    <Button
                        variant={row.isActive ? 'danger' : 'secondary'}
                        isLoading={toggleActive.isPending}
                        onClick={() => setConfirmAction({ type: 'status', row })}
                    >
                        {row.isActive ? "O'chirish" : 'Faollashtirish'}
                    </Button>
                ) : null,
        },
    ]

    const handleConfirm = () => {
        if (!confirmAction) return
        if (confirmAction.type === 'role') {
            changeRole.mutate({ id: confirmAction.row._id, role: confirmAction.newRole })
        } else if (confirmAction.type === 'status') {
            toggleActive.mutate({ id: confirmAction.row._id, isActive: confirmAction.row.isActive })
        }
    }

    return (
        <div className="p-4">
            {/* Tab bошqaruvi */}
            <div className="mb-4 flex gap-2 border-b dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => setActiveTab('employees')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'employees'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                >
                    Xodimlar
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'attendance'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                >
                    Davomat
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('audit')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'audit'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                >
                    Audit log
                </button>
            </div>

            {activeTab === 'employees' && (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <Input
                            placeholder="Qidirish (ism, email)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Barcha rollar</option>
                            {Object.values(ROLES).map((role) => (
                                <option key={role} value={role}>
                                    {ROLE_LABELS[role]}
                                </option>
                            ))}
                        </select>
                        {canCreate && (
                            <Button onClick={() => setIsModalOpen(true)} className="ml-auto">
                                + Yangi xodim
                            </Button>
                        )}
                    </div>

                    {isError ? (
                        <p className="text-red-500">Xodimlarni yuklashda xatolik yuz berdi</p>
                    ) : (
                        <Table columns={columns} data={filtered} isLoading={isLoading} emptyMessage="Xodimlar topilmadi" />
                    )}

                    <div className="mt-4 flex justify-center gap-2">
                        <Button variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                            Oldingi
                        </Button>
                        <span className="flex items-center px-2 text-sm text-gray-500">Sahifa {page}</span>
                        <Button
                            variant="secondary"
                            disabled={!data || data.length < 20}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Keyingi
                        </Button>
                    </div>

                    {canCreate && (
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false)
                                reset()
                            }}
                            title="Yangi xodim qo'shish"
                        >
                            <form
                                onSubmit={handleSubmit((formData) => createUserMutation.mutate(formData))}
                                className="space-y-3"
                            >
                                <Input label="Ism" {...register('name')} error={errors.name?.message} />
                                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                                <Input label="Parol" type="password" {...register('password')} error={errors.password?.message} />
                                <Input label="Telefon" {...register('phone')} error={errors.phone?.message} />
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Rol
                                    </label>
                                    <select
                                        {...register('role')}
                                        className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Rolni tanlang</option>
                                        {Object.values(ROLES).map((role) => (
                                            <option key={role} value={role}>
                                                {ROLE_LABELS[role]}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                                </div>
                                <Button type="submit" isLoading={isSubmitting || createUserMutation.isPending}>
                                    Qo'shish
                                </Button>
                            </form>
                        </Modal>
                    )}

                    <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title="Tasdiqlang">
                        {confirmAction?.type === 'role' && (
                            <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
                                <strong>{confirmAction.row.name}</strong>ning rolini{' '}
                                <strong>{ROLE_LABELS[confirmAction.newRole]}</strong>ga o'zgartirmoqchimisiz?
                            </p>
                        )}
                        {confirmAction?.type === 'status' && (
                            <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
                                <strong>{confirmAction.row.name}</strong>ni{' '}
                                {confirmAction.row.isActive ? "faolsizlantirmoqchimisiz" : 'faollashtirmoqchimisiz'}?
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setConfirmAction(null)}>
                                Bekor qilish
                            </Button>
                            <Button
                                variant="danger"
                                isLoading={changeRole.isPending || toggleActive.isPending}
                                onClick={handleConfirm}
                            >
                                Tasdiqlash
                            </Button>
                        </div>
                    </Modal>
                </>
            )}

            {activeTab === 'attendance' && <AttendanceTable />}

            {activeTab === 'audit' && <AuditLogPage />}
        </div>
    )
}