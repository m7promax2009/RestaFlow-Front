import React, { useState } from 'react';

export default function AttendanceTable({ attendances = [], onRefresh }) {
  const [filterRole, setFilterRole] = useState('all');

  const mockLogs = [
    { id: '1', name: 'Zulfiqor', role: 'admin', date: '2026-07-30', checkIn: '08:45', checkOut: '18:15', status: 'Kelgan', hours: '9.5 soat' },
    { id: '2', name: 'Madina', role: 'cashier', date: '2026-07-30', checkIn: '09:00', checkOut: '17:30', status: 'Kelgan', hours: '8.5 soat' },
    { id: '3', name: 'Abdugani', role: 'waiter', date: '2026-07-30', checkIn: '09:15', checkOut: '—', status: 'Ishda', hours: '6.0 soat' },
    { id: '4', name: 'Ziyodilla', role: 'chef', date: '2026-07-30', checkIn: '08:30', checkOut: '—', status: 'Ishda', hours: '6.8 soat' },
    { id: '5', name: 'Izzat', role: 'waiter', date: '2026-07-30', checkIn: '10:00', checkOut: '16:00', status: 'Kechikkan', hours: '6.0 soat' },
  ];

  const list = attendances.length > 0 ? attendances : mockLogs;
  const filtered = filterRole === 'all' ? list : list.filter(item => item.role === filterRole);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">📅 Xodimlar Davomati va Ish Vaqtlari</h3>
          <p className="text-xs text-slate-400">Kunlik kirish-chiqish va ishlangan soatlar hisobi</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Barcha rollar</option>
            <option value="admin">Admin</option>
            <option value="manager">Menejer</option>
            <option value="cashier">Kassir</option>
            <option value="waiter">Ofitsiant</option>
            <option value="chef">Oshpaz</option>
          </select>
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
          >
            🔄 Yangilash
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Xodim</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Sana</th>
              <th className="py-3 px-4">Check-In</th>
              <th className="py-3 px-4">Check-Out</th>
              <th className="py-3 px-4">Ishlangan soat</th>
              <th className="py-3 px-4 rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-100">{item.name}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wide bg-slate-800 text-amber-400 border border-slate-700">
                    {item.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">{item.checkIn}</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">{item.checkOut}</td>
                <td className="py-3.5 px-4 text-slate-200">{item.hours}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      item.status === 'Kelgan' || item.status === 'Ishda'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
