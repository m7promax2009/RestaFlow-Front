// Axios instance — barcha API so'rovlari shu orqali yuboriladi.
// Mas'ul: Fayoz (auth interceptor). Foydalanadi: hamma feature.
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-production-11b7.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

const isValidToken = (token) => token && token !== 'undefined' && token !== 'null'

// So'rovga token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (isValidToken(token)) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 bo'lsa refresh token orqali yangilash, so'rovni qayta yuborish
let refreshPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error
    const isAuthRoute = config?.url?.startsWith('/auth/')

    if (response?.status !== 401 || isAuthRoute || config._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!isValidToken(refreshToken)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.assign('/login')
      return Promise.reject(error)
    }

    config._retry = true

    try {
      refreshPromise ??= axios
        .post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
        .finally(() => {
          refreshPromise = null
        })

      const res = await refreshPromise
      const data = res.data?.data ?? res.data
      localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)

      config.headers.Authorization = `Bearer ${data.accessToken}`
      return api(config)
    } catch (refreshError) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.assign('/login')
      return Promise.reject(refreshError)
    }
  },
)

export default api
