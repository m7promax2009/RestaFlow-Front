// Restoran sozlamalari API — Backend/src/routes/settings.routes.js bilan mos.
import api from '../../services/axios'

export const getSettings = () => api.get('/settings')
export const updateSettings = (payload) => api.put('/settings', payload)