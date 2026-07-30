import React, { useState } from 'react';

export default function AuditLogPage() {
  const [logs] = useState([
    { id: '1', user: 'Zulfiqor', action: 'ROLE_UPDATE', target: 'Madina Kassir rol berildi', time: '10 daqiqa oldin', ip: '192.168.1.12' },
    { id: '2', user: 'Abdurahmon', action: 'PASSWORD_RESET', target: 'Xodim paroli yangilandi', time: '45 daqiqa oldin', ip: '192.168.1.15' },
    { id: '3', user: 'Admin', action: 'PRICING_CHANGE', target: 'Stak steak narxi o\'zgardi', time: '2 soat oldin', ip: '192.168.1.1' },
    { id: '4', user: 'Madina', action: 'PAYMENT_REFUND', target: 'Stol #3 to\'lovi bekor qilindi', time: '3 soat oldin', ip: '192.168.1.20' },
    { id: '5', user: 'Ziyodilla', action: 'MENU_AVAILABILITY', target: 'Lag\'mon taomi "mavjud emas" qilindi', time: '5 soat oldin', ip: '192.168.1.33' },
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">🛡️ Tizim Harakatlari Tarixi (Audit Trail)</h2>
          <p className="text-sm text-slate-400">Admin va menejerlar tomonidan bajirilgan muhim amallar jurnali</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Foydalanuvchi</th>
                <th className="py-3 px-4">Amal Turi</th>
                <th className="py-3 px-4">Tavsif / O'zgarish</th>
                <th className="py-3 px-4">Vaqt</th>
                <th className="py-3 px-4 rounded-r-xl">IP Manzil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-100">{log.user}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">{log.target}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs">{log.time}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
