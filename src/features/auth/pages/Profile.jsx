import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { authApi } from '../api'
import { ROLE_LABELS } from '../../../constants/roles'

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data?.data?.user ?? res.data?.user ?? res.data
    },
  })

  if (isLoading) {
    return <p className="p-4 text-gray-400">Yuklanmoqda...</p>
  }

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-xl font-bold">Profil</h1>

      <div className="space-y-2 rounded-lg border p-4 dark:border-gray-700">
        <p><span className="font-medium">Ism:</span> {user?.name}</p>
        <p><span className="font-medium">Email:</span> {user?.email}</p>
        <p><span className="font-medium">Rol:</span> {ROLE_LABELS[user?.role] ?? user?.role}</p>
        <p>
          <span className="font-medium">Holat:</span>{' '}
          {user?.isActive ? (
            <span className="text-green-600">Faol</span>
          ) : (
            <span className="text-gray-400">Faol emas</span>
          )}
        </p>
      </div>

      <p className="text-sm text-gray-500">
        Ma'lumotlarni o'zgartirish hozircha mavjud emas.
        Parolni unutgan bo'lsangiz,{' '}
        <Link to="/forgot-password" className="text-blue-600">
          shu yerdan
        </Link>{' '}
        tiklashingiz mumkin.
      </p>
    </div>
  )
}