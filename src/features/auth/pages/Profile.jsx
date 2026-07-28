import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { authApi } from '../api'
import { ROLE_LABELS } from '../../../constants/roles'
import { Modal, Input, Button } from '../../../components/ui'

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Kamida 6 ta belgi"),
    newPassword: z.string().min(6, "Kamida 6 ta belgi"),
    confirmPassword: z.string().min(6, "Kamida 6 ta belgi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar mos emas",
    path: ['confirmPassword'],
  })

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data?.data?.user ?? res.data?.user ?? res.data
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) })

  const changePasswordMutation = useMutation({
    mutationFn: (data) =>
      authApi.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword }),
    onSuccess: () => {
      toast.success("Parol muvaffaqiyatli o'zgartirildi")
      reset()
      setIsModalOpen(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Parolni o'zgartirishda xatolik")
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

      <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
        Parolni o'zgartirish
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        title="Parolni o'zgartirish"
      >
        <form
          onSubmit={handleSubmit((data) => changePasswordMutation.mutate(data))}
          className="space-y-3"
        >
          <Input
            label="Eski parol"
            type="password"
            {...register('oldPassword')}
            error={errors.oldPassword?.message}
          />
          <Input
            label="Yangi parol"
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Input
            label="Yangi parolni tasdiqlang"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Button type="submit" isLoading={isSubmitting || changePasswordMutation.isPending}>
            Saqlash
          </Button>
        </form>
      </Modal>
    </div>
  )
}