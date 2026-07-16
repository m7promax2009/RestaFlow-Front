import React from 'react';
import Chart from 'react-apexcharts';
import { statsData, chartData, recentOrders } from '../mock/dashboardMock';

export default function Dashboard() {
  const chartOptions = {
    chart: { id: 'revenue-chart', type: 'area', toolbar: { show: false } },
    colors: ['#4F46E5'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 }
    },
    xaxis: { categories: chartData.categories },
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' }
  };

  // Функции-заглушки для будущего экспорта
  const handleExportPDF = () => {
    alert('Экспорт в PDF запускается...');
  };

  const handleExportExcel = () => {
    alert('Экспорт в Excel запускается...');
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Панель мониторинга</h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Привет, Мадина! Вот актуальные показатели ресторана на сегодня.</p>
      </div>

      {/* КАРТОЧКИ МЕТРИК */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '35px' }}>
        {statsData.map(stat => (
          <div key={stat.id} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', margin: '12px 0 6px 0', color: '#0f172a' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: stat.isPositive ? '#10b981' : '#ef4444', fontWeight: '600' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* ГРАФИК */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', marginBottom: '35px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: '600' }}>Аналитика выручки по часам</h3>
        <Chart options={chartOptions} series={chartData.series} type="area" height={320} />
      </div>

      {/* ТАБЛИЦА С КНОПКАМИ ЭКСПОРТА */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>

        {/* Шапка таблицы с кнопками */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
          <div />
          <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '600', textAlign: 'center' }}>Последние активные заказы</h3>

          <div style={{ display: 'flex', gap: '10px', justifySelf: 'end' }}>
            <button
              onClick={handleExportExcel}
              style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '650', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              📊 Экспорт Excel
            </button>
            <button
              onClick={handleExportPDF}
              style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '650', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              📄 Экспорт PDF
            </button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: '600' }}>
              <th style={{ padding: '12px 16px' }}>ID Заказа</th>
              <th style={{ padding: '12px 16px' }}>Стол</th>
              <th style={{ padding: '12px 16px' }}>Официант</th>
              <th style={{ padding: '12px 16px' }}>Сумма</th>
              <th style={{ padding: '12px 16px' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                <td style={{ padding: '14px 16px', fontWeight: '500' }}>#{order.id}</td>
                <td style={{ padding: '14px 16px' }}>{order.table}</td>
                <td style={{ padding: '14px 16px' }}>{order.waiter}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{order.total}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: order.status === 'Paid' ? '#dcfce7' : order.status === 'Ready' ? '#fef9c3' : '#f1f5f9',
                    color: order.status === 'Paid' ? '#15803d' : order.status === 'Ready' ? '#854d0e' : '#475569'
                  }}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}