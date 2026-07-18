import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Ro‘yxatdan o‘tish</h2>
        <RegisterForm />
        <div className="auth-actions">
          <Link to="/login">Mavjud hisobra kiring</Link>
        </div>
      </div>
    </div>
  )
}
