import { Link } from 'react-router-dom'

export default function GuestMenuPage() {
  return (
    <div className="guest-page">
      <h1>Гостевое меню</h1>
      <p>Здесь гость сможет посмотреть меню и оформить заказ без входа в систему.</p>
      <Link to="/login">Вход для персонала</Link>
    </div>
  )
}
