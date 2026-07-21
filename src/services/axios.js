// Axios instance — barcha API so'rovlari shu orqali yuboriladi.
// Mas'ul: Fayoz (auth interceptor). Foydalanadi: hamma feature.
import axios from 'axios'
import { disconnectSocket } from './socket'

const baseURL = import.meta.env.VITE_API_URL || 'https://backend-production-11b7.up.railway.app/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// So'rovga token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 bo'lganda refresh token orqali yangilash, so'ngra so'rovni qayta yuborish.
// Bir vaqtda bir nechta so'rov 401 qaytarsa, faqat bitta refresh so'rovi yuboriladi
// — qolganlari navbatga (pendingQueue) qo'yiladi va refresh tugagach davom etadi.
let isRefreshing = false
let pendingQueue = []

const processQueue = (error, accessToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(accessToken)
  })
  pendingQueue = []
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password']

const redirectToLogin = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  disconnectSocket()
  window.location.href = '/login'
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) => originalRequest?.url?.includes(url))

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      redirectToLogin()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((accessToken) => {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
      localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)

      processQueue(null, data.accessToken)
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      redirectToLogin()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
