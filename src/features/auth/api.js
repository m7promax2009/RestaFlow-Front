import axios from '../../services/axios'

export const authApi = {
  login: async (credentials) => {
    return axios.post('/auth/login', credentials)
  },
  register: async (payload) => {
    return axios.post('/auth/register', payload)
  },
  forgotPassword: async (payload) => {
    return axios.post('/auth/forgot-password', payload)
  },
  resetPassword: async (payload) => {
    // payload: { token, newPassword }
    return axios.post('/auth/reset-password', payload)
  },
  getMe: async () => {
    return axios.get('/auth/me')
  },
  changePassword: async (payload) => {
    // payload: { oldPassword, newPassword }
    return axios.post('/auth/change-password', payload)
  },
}