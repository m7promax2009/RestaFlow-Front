import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { setCredentials } from '../authSlice'

const schema = z.object({
  email: z.string().email('Email noto‘g‘ri'),
  password: z.string().min(6, 'Kamida 6 ta belgi bo‘lishi kerak'),
})

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    setError(null)
    try {
      const response = await authApi.login(values)
      const data = response.data?.data ?? response.data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Tizimga kirishda xatolik yuz berdi')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
        Kirish
      </button>
    </form>
  )
}
