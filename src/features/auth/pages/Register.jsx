import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'

const schema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgi bo'lishi kerak"),
  email: z.string().email("Email noto'g'ri formatda"),
  password: z.string().min(6, "Kamida 6 ta belgi bo'lishi kerak"),
  confirmPassword: z.string().min(6, "Kamida 6 ta belgi bo'lishi kerak"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar mos kelmaydi",
  path: ["confirmPassword"],
})

/* SVG Icons */
const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const animationStyles = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse3d { 0%,100%{transform:perspective(600px) rotateY(0deg) scale(1)} 50%{transform:perspective(600px) rotateY(5deg) scale(1.02)} }
  @keyframes slideReveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0 0 0)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(249,115,22,0.3)} 50%{box-shadow:0 0 40px rgba(249,115,22,0.6)} }
  @keyframes imageZoom { from{transform:scale(1.15)} to{transform:scale(1)} }
  @keyframes rotate3d { 0%{transform:perspective(800px) rotateY(-8deg) rotateX(2deg)} 50%{transform:perspective(800px) rotateY(8deg) rotateX(-2deg)} 100%{transform:perspective(800px) rotateY(-8deg) rotateX(2deg)} }
`

export default function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values) => {
    setError(null)
    try {
      await authApi.register({ name: values.name, email: values.email, password: values.password })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi")
    }
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div className="flex h-screen w-full overflow-hidden bg-[#FFFDF9] font-sans">

        {/* LEFT HERO SECTION */}
        <div className="relative hidden w-[45%] lg:flex lg:flex-col lg:justify-between overflow-hidden">
          {/* Background image with 3D rotation */}
          <div
            className="absolute inset-0"
            style={{ animation: 'rotate3d 20s ease-in-out infinite' }}
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80"
              alt="Premium restaurant interior"
              className="h-full w-full object-cover"
              style={{ animation: 'imageZoom 1.5s ease-out forwards' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70" />
          </div>

          {/* Dark solid overlay for readability */}
          <div className="absolute inset-0 bg-[#111827]/40" />

          {/* Floating decorative circles */}
          <div className="absolute top-20 right-10 h-32 w-32 rounded-full border border-white/10" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute bottom-40 left-8 h-20 w-20 rounded-full border border-[#F97316]/20" style={{ animation: 'float 4s ease-in-out infinite 1s' }} />
          <div className="absolute top-1/2 right-20 h-16 w-16 rounded-full bg-[#F97316]/10" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }} />

          <div className="relative z-10 flex flex-col justify-between h-full px-12 py-10">
            {/* Logo */}
            <div
              className="inline-flex items-center gap-3 rounded-2xl bg-black/40 px-5 py-3 backdrop-blur-sm"
              style={{ animation: 'fadeInLeft 1s ease-out 0.2s both' }}
            >
              <img
                src="/restoflow-logo.svg"
                alt="RestoFlow"
                className="h-14 w-auto"
                style={{ filter: 'brightness(1.2) drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
              />
            </div>

            {/* Heading */}
            <div
              className="max-w-lg rounded-3xl bg-black/50 p-6 backdrop-blur-sm"
              style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
            >
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F97316 50%, #FBBF24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}>
                Yangi hisob ochib,{' '}
                <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.6))' }}>
                  boshlang
                </span>
              </h1>
              <p
                className="mt-4 text-base leading-relaxed text-white/80"
                style={{ animation: 'slideReveal 1.2s ease-out 0.8s both' }}
              >
                oshxona va jamoani bir tizimda boshqaring.
              </p>
            </div>

            {/* Features cards with 3D effect */}
            <div className="space-y-3 max-w-sm">
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg"
                style={{ animation: 'pulse3d 4s ease-in-out infinite' }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/25 text-green-400"
                  style={{ animation: 'scaleIn 0.8s ease-out 1s both' }}
                >
                  <CheckCircleIcon />
                </div>
                <span className="text-sm font-medium text-white">Bepul sinov muddati 14 kun</span>
              </div>
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg"
                style={{ animation: 'pulse3d 4s ease-in-out infinite 0.5s' }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316]/25 text-[#F97316]"
                  style={{ animation: 'scaleIn 0.8s ease-out 1.2s both' }}
                >
                  <ClockIcon />
                </div>
                <span className="text-sm font-medium text-white">2 daqiqada ro'yxatdan o'ting</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT REGISTER CARD */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div
            className="w-full max-w-[440px] rounded-[32px] bg-white p-12 shadow-[0_25px_80px_rgba(0,0,0,0.08)]"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}
          >
            {/* Tab */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-8">
              <div className="flex items-center gap-2 text-[#F97316]">
                <UserPlusIcon />
                <span className="text-lg font-bold">Ro'yxatdan o'tish</span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#111827]">
                Yangi hisob yarating
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Malumotlarni kiriting va restoraningizni boshqarishni boshlang.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]" htmlFor="name">
                  Ism
                </label>
                <div className="relative">
                  <UserIcon />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ismingizni kiriting"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFDF9] py-3 pl-11 pr-4 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]" htmlFor="register-email">
                  Email
                </label>
                <div className="relative">
                  <MailIcon />
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="email@misol.uz"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFDF9] py-3 pl-11 pr-4 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]" htmlFor="register-password">
                  Parol
                </label>
                <div className="relative">
                  <LockIcon />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="********"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFDF9] py-3 pl-11 pr-11 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]" htmlFor="confirm-password">
                  Parolni tasdiqlang
                </label>
                <div className="relative">
                  <LockIcon />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="********"
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#FFFDF9] py-3 pl-11 pr-4 text-sm text-[#111827] placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#F97316] to-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ height: '52px' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Yuborilmoqda...
                  </span>
                ) : "Ro'yxatdan o'tish"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#6B7280]">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="font-semibold text-[#F97316] hover:text-orange-600 transition-colors">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
