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
}
