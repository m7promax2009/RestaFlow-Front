import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'

const schema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgi bo‘lishi kerak'),
  email: z.string().email('Email noto‘g‘ri'),
  password: z.string().min(6, 'Kamida 6 ta belgi bo‘lishi kerak'),
})

export default function RegisterForm() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    setError(null)
    try {
      await authApi.register(values)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <label>
        Ism
        <input type="text" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>

      <label>
        Email
        <input type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>

      <label>
        Parol
        <input type="password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        Ro‘yxatdan o‘tish
      </button>
    </form>
  )
}
