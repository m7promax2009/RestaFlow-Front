import { FiArrowUpRight, FiClock, FiCheckCircle, FiAlertCircle, FiUsers, FiChevronRight } from 'react-icons/fi'

const stats = [
  { label: 'Активные заказы', value: '24', detail: '+4 новых', icon: FiShoppingCart, color: 'var(--card-green)' },
  { label: 'Свободные столы', value: '12 / 36', detail: '33% свободно', icon: FiCheckCircle, color: 'var(--card-yellow)' },
  { label: 'Сотрудники на смене', value: '18 из 25', detail: 'В работе', icon: FiUsers, color: 'var(--card-purple)' },
  { label: 'Выручка за день', value: '128 450 ₽', detail: '+12.5%', icon: FiArrowUpRight, color: 'var(--card-cyan)' },
]

const orders = [
  { id: '#1058', status: 'Новый', table: 'Стол 5', time: '12:45' },
  { id: '#1057', status: 'Готовится', table: 'Стол 2', time: '12:40' },
  { id: '#1056', status: 'Готов', table: 'Стол 3', time: '12:35' },
  { id: '#1055', status: 'Отменён', table: 'Доставка', time: '12:30' },
  { id: '#1054', status: 'Новый', table: 'Стол 8', time: '12:20' },
]

const dishes = [
  { name: 'Фирменный бургер', sold: 45, price: '650 ₽' },
  { name: 'Цезарь с курицей', sold: 38, price: '550 ₽' },
  { name: 'Паста карбонара', sold: 32, price: '620 ₽' },
  { name: 'Тирамису', sold: 28, price: '320 ₽' },
]

const staff = [
  { name: 'Иван Петров', role: 'Администратор', status: 'На смене' },
  { name: 'Мария Смирнова', role: 'Официант', status: 'На смене' },
  { name: 'Дмитрий Кузнецов', role: 'Повар', status: 'На смене' },
  { name: 'Анна Васильева', role: 'Бармен', status: 'Выходной' },
  { name: 'Сергей Лебедев', role: 'Официант', status: 'На смене' },
]

const bookings = [
  { time: 'Сегодня, 14:00', table: 'Стол 4', guest: 'Иван Сидоров' },
  { time: 'Сегодня, 15:30', table: 'Стол 7', guest: 'Ольга Николаева' },
  { time: 'Сегодня, 18:00', table: 'Стол 1', guest: 'Алексей Иванов' },
  { time: 'Сегодня, 20:00', table: 'Стол 10', guest: 'Мария Петрова' },
]

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-top-cards">
        {stats.map(({ label, value, detail, icon: Icon, color }) => (
          <div key={label} className="dashboard-card" style={{ borderColor: color }}>
            <div className="dashboard-card-header">
              <span>{label}</span>
              <Icon className="card-icon" />
            </div>
            <div className="dashboard-card-value">{value}</div>
            <div className="dashboard-card-detail">{detail}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-body-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Последние заказы</h2>
              <p>Просмотреть все</p>
            </div>
          </div>

          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>№ заказа</th>
                  <th>Статус</th>
                  <th>Стол / Доставка</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td><span className={`status-pill status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></td>
                    <td>{order.table}</td>
                    <td>{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel floor-panel">
          <div className="panel-header">
            <div>
              <h2>Карта зала</h2>
              <p>Смотреть все</p>
            </div>
          </div>
          <div className="floor-plan">
            <div className="floor-row">
              <div className="floor-table free">1</div>
              <div className="floor-table busy">2</div>
              <div className="floor-table free">3</div>
              <div className="floor-table reserved">4</div>
            </div>
            <div className="floor-row">
              <div className="floor-table free circle">5</div>
              <div className="floor-table busy circle">6</div>
              <div className="floor-table reserved">7</div>
            </div>
            <div className="floor-row">
              <div className="floor-table reserved">8</div>
              <div className="floor-table free">9</div>
              <div className="floor-table free">10</div>
            </div>
          </div>
          <div className="floor-legend">
            <span><span className="legend-dot free" />Свободен</span>
            <span><span className="legend-dot busy" />Занят</span>
            <span><span className="legend-dot reserved" />Бронь</span>
            <span><span className="legend-dot inactive" />Неактивен</span>
          </div>
        </section>
      </div>

      <div className="dashboard-body-grid bottom-grid">
        <section className="dashboard-panel small-panel">
          <div className="panel-header">
            <div>
              <h2>Популярные блюда</h2>
              <p>Смотреть все</p>
            </div>
          </div>
          <div className="items-list">
            {dishes.map((item) => (
              <div key={item.name} className="item-row">
                <div>
                  <strong>{item.name}</strong>
                  <p>Продано: {item.sold}</p>
                </div>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel small-panel">
          <div className="panel-header">
            <div>
              <h2>Сотрудники на смене</h2>
              <p>Смотреть все</p>
            </div>
          </div>
          <div className="items-list">
            {staff.map((person) => (
              <div key={person.name} className="item-row">
                <div>
                  <strong>{person.name}</strong>
                  <p>{person.role}</p>
                </div>
                <span className={person.status === 'На смене' ? 'status-green' : 'status-grey'}>{person.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel small-panel">
          <div className="panel-header">
            <div>
              <h2>Ближайшие брони</h2>
              <p>Смотреть все</p>
            </div>
          </div>
          <div className="items-list">
            {bookings.map((booking) => (
              <div key={booking.time} className="booking-row">
                <div>
                  <strong>{booking.time}</strong>
                  <p>{booking.guest}</p>
                </div>
                <span>{booking.table}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
