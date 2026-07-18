// Auth backend so'rovlari — services/axios orqali.
// Manba: Abdurahmon (api/authApi.js), arxitekturaga moslashtirildi.
import api from '../../services/axios'

export const registerRequest = (data) => api.post('/auth/register', data)
// data: { name, email, password, phone }
// Eslatma: backend endi `role`ni e'tiborsiz qoldiradi — yangi user doim 'waiter'.

export const loginRequest = (data) => api.post('/auth/login', data)
// data: { email, password } → response.data.data: { accessToken, refreshToken, user }

export const refreshRequest = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken })

export const meRequest = () => api.get('/auth/me')
