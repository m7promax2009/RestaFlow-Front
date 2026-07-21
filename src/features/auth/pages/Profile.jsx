import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCredentials } from '../authSlice'
import { disconnectSocket } from '../../../services/socket'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    disconnectSocket()
    dispatch(clearCredentials())
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <h1>Profil</h1>
      <p>Profil sahifasi keyinchalik foydalanuvchi ma'lumotlari bilan to'ldiriladi.</p>
      <button type="button" onClick={handleLogout}>Chiqish</button>
    </div>
  )
}
