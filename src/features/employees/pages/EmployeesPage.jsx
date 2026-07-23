import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getUsers, updateUser } from '../api'
import { ROLES, ROLE_LABELS } from '../../../constants/roles'
import { Input, Table, Button } from '../../../components/ui'

export default function EmployeesPage() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['users', page],
        queryFn: async () => {
            const res = await getUsers({ page, limit: 20 })
            const payload = res.data.data ?? res.data
            return payload.users ?? payload ?? []
        },
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

    const toggleActive = useMutation({
        mutationFn: ({ id, isActive }) => updateUser(id, { isActive: !isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success("Holat yangilandi")
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Xatolik yuz berdi")
        },
    })

    const changeRole = useMutation({
        mutationFn: ({ id, role }) => updateUser(id, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success("Rol yangilandi")
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Rolni yangilashda xatolik")
        },
    })

    const columns = [
        { key: 'name', title: 'Ism' },
        { key: 'email', title: 'Email' },
        {
            key: 'role',
            title: 'Rol',
            render: (row) => (
                <select
                    value={row.role}
                    disabled={changeRole.isPending}
                    onChange={(e) => changeRole.mutate({ id: row._id, role: e.target.value })}
                    className="rounded-md border px-2 py-1 text-xs dark:bg-gray-700 dark:text-white"
                >
                    {Object.values(ROLES).map((role) => (
                        <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                        </option>
                    ))}
                </select>
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
            render: (row) => (
                <Button
                    variant={row.isActive ? 'danger' : 'secondary'}
                    isLoading={toggleActive.isPending}
                    onClick={() => toggleActive.mutate({ id: row._id, isActive: row.isActive })}
                >
                    {row.isActive ? "O'chirish" : 'Faollashtirish'}
                </Button>
            ),
        },
    ]

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-3">
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
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                    Keyingi
                </Button>
            </div>
        </div>
    )
}