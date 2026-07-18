import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Kirish</h2>
        <LoginForm />
        <div className="auth-actions">
          <Link to="/register">Ro‘yxatdan o‘tish</Link>
          <Link to="/forgot-password">Parolni unutdingizmi?</Link>
        </div>
      </div>
    </div>
  )
}
