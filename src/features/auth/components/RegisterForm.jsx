import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { registerSchema } from '../authSchemas'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
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
        <input type="text" placeholder="Ism va familiya" autoComplete="name" {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>

      <label>
        Email
        <input type="email" placeholder="siz@gmail.com" autoComplete="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>

      <label>
        Telefon raqam
        <input type="tel" placeholder="+998 90 123 45 67" autoComplete="tel" {...register('phone')} />
        {errors.phone && <span className="error">{errors.phone.message}</span>}
      </label>

      <label>
        Parol
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Parol"
            autoComplete="new-password"
            {...register('password')}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Yashirish' : 'Ko‘rsatish'}
          </button>
        </div>
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        Ro‘yxatdan o‘tish
      </button>
    </form>
  )
}
