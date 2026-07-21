import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { getDashboardStats, getDailySales } from '../../../services/dashboardService';

// Backend hali token talab qiladi va login sahifasi tayyor emas (401 kutilgan holat).
// Shuning uchun fetch muvaffaqiyatsiz bo'lsa, shu mock ma'lumotga fallback qilamiz.
const mockStats = {
  todayRevenue: 2450000,
  revenueChange: 12.4,
  activeOrders: 18,
  activeOrdersChange: 4.2,
  occupiedTables: 12,
  totalTables: 20,
  avgCheck: 136000,
  avgCheckChange: -1.8,
};

const mockChart = {
  categories: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
  series: [450000, 890000, 1200000, 950000, 1400000, 2100000, 1850000, 600000],
};

// TODO: dashboardService'da "so'nggi faol buyurtmalar" uchun mos endpoint yo'q
// (faqat getTopProducts bor). Shu jadval hozircha mock holida qoladi.
const recentOrders = [
  { id: "1024", table: "Stol #5", waiter: "Alisher", total: "245,000 so'm", status: "Tayyorlanmoqda" },
  { id: "1025", table: "Stol #12", waiter: "Sardor", total: "112,000 so'm", status: "Tayyor" },
  { id: "1026", table: "Stol #2", waiter: "Dilnoza", total: "560,000 so'm", status: "To'landi" },
];

const statusStyles = {
  "To'landi": "bg-emerald-50 text-emerald-700",
  "Tayyor": "bg-amber-50 text-amber-700",
  "Tayyorlanmoqda": "bg-slate-100 text-slate-600",
};

function formatSom(n) {
  return `${Number(n ?? 0).toLocaleString()} so'm`;
}

function formatChange(n) {
  const num = Number(n ?? 0);
  return `${num >= 0 ? '+' : ''}${num}%`;
}

// TODO: haqiqiy backend field nomlari login/token tayyor bo'lgach tasdiqlanishi kerak.
function buildStatsCards(stats) {
  return [
    { id: 1, title: "Bugungi tushum", value: formatSom(stats.todayRevenue), change: formatChange(stats.revenueChange), isPositive: stats.revenueChange >= 0, icon: DollarSign },
    { id: 2, title: "Faol buyurtmalar", value: String(stats.activeOrders ?? 0), change: formatChange(stats.activeOrdersChange), isPositive: stats.activeOrdersChange >= 0, icon: ShoppingBag },
    { id: 3, title: "Band stollar", value: `${stats.occupiedTables ?? 0} / ${stats.totalTables ?? 0}`, change: `${stats.totalTables ? Math.round((stats.occupiedTables / stats.totalTables) * 100) : 0}% band`, isPositive: true, icon: Utensils },
    { id: 4, title: "O'rtacha chek", value: formatSom(stats.avgCheck), change: formatChange(stats.avgCheckChange), isPositive: stats.avgCheckChange >= 0, icon: Receipt },
  ];
}

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats);
  const [chart, setChart] = useState(mockChart);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsRes, salesRes] = await Promise.all([getDashboardStats(), getDailySales()]);
        if (cancelled) return;

        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
          setUsingMock(false);
        }
        if (salesRes.data?.data) {
          setChart(salesRes.data.data);
        }
      } catch (err) {
        // Token yo'q (401) yoki backend mavjud emas — mock ma'lumot bilan davom etamiz.
        console.info("Dashboard: real API'dan ma'lumot olinmadi, mock ko'rsatilmoqda.", err?.response?.status ?? err?.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const statsData = buildStatsCards(stats);

  const chartOptions = {
    chart: { id: 'revenue-chart', type: 'area', toolbar: { show: false } },
    colors: ['#059669'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 }
    },
    xaxis: { categories: chart.categories },
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' }
  };
  const chartSeries = [{ name: "Tushum (so'm)", data: chart.series }];

  const handleExportPDF = () => {
    alert('PDF eksport ishga tushmoqda...');
  };

  const handleExportExcel = () => {
    alert('Excel eksport ishga tushmoqda...');
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Boshqaruv paneli</h1>
        <p className="text-sm text-slate-500 mt-1">Salom, Madina! Restoranning bugungi ko'rsatkichlari shu yerda.</p>
      </div>

      {!loading && usingMock && (
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Hozircha namunaviy (mock) ma'lumot ko'rsatilmoqda — tizimga kirilgach haqiqiy ma'lumot avtomatik yuklanadi.
        </div>
      )}

      {/* Statistika kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map(stat => {
          const Icon = stat.icon;
          const TrendIcon = stat.isPositive ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.title}</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-3">{stat.value}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                <TrendIcon className="w-3.5 h-3.5" />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafik */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Soatlik tushum analitikasi</h3>
        <Chart options={chartOptions} series={chartSeries} type="area" height={320} />
      </div>

      {/* Faol buyurtmalar jadvali */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-base font-semibold text-slate-900">So'nggi faol buyurtmalar</h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition"
            >
              <FileText className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-4">Buyurtma ID</th>
                <th className="py-3 px-4">Stol</th>
                <th className="py-3 px-4">Ofitsiant</th>
                <th className="py-3 px-4">Summa</th>
                <th className="py-3 px-4">Holati</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-3.5 px-4 font-medium">#{order.id}</td>
                  <td className="py-3.5 px-4">{order.table}</td>
                  <td className="py-3.5 px-4">{order.waiter}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{order.total}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
