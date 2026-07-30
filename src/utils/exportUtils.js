export { exportToExcel, exportToCSV } from './exportToExcel'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * PDF formatida hisobotlarni yuklab olish helper funksiyasi
 * @param {Object} options
 * @param {Object} options.stats - bugungi ko'rsatkichlar
 * @param {Array} options.topProducts - eng ko'p sotilgan taomlar
 * @param {Array} options.dailySales - kunlik sotuvlar
 * @param {string} options.filename - fayl nomi
 */
export function exportToPDF({ stats = {}, topProducts = [], dailySales = [], filename = 'RestoFlow_Hisobot.pdf' }) {
  const doc = new jsPDF()

  // Sarlavha
  doc.setFontSize(20)
  doc.setTextColor(79, 70, 229) // Indigo-600
  doc.text('RestoFlow — Analitika Hisoboti', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Sana: ${new Date().toLocaleString('ru-RU')}`, 14, 28)

  let finalY = 35

  // 1. Asosiy statistika jadvali
  const avgCheck = stats.todayPaymentsCount ? Math.round(stats.todayRevenue / stats.todayPaymentsCount) : 0
  autoTable(doc, {
    startY: finalY,
    head: [['Ko\'rsatkich', 'Qiymat']],
    body: [
      ['Bugungi tushum', `${Number(stats.todayRevenue || 0).toLocaleString('ru-RU')} so'm`],
      ['To\'lovlar soni', `${stats.todayPaymentsCount || 0} ta`],
      ['Buyurtmalar soni', `${stats.todayOrdersCount || 0} ta`],
      ['Faol buyurtmalar', `${stats.activeOrdersCount || 0} ta`],
      ['O\'rtacha chek', `${avgCheck.toLocaleString('ru-RU')} so'm`],
      ['Omborda kam qolgan mahsulotlar', `${stats.lowStockCount || 0} ta`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  finalY = doc.lastAutoTable.finalY + 10

  // 2. Top taomlar jadvali
  if (topProducts.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Eng ko\'p sotilgan taomlar', 14, finalY)

    autoTable(doc, {
      startY: finalY + 4,
      head: [['#', 'Taom nomi', 'Sotilgan soni', 'Tushum']],
      body: topProducts.map((p, i) => [
        i + 1,
        p.name || p.productName || '—',
        `${p.totalQuantity || p.quantity || 0} ta`,
        p.totalRevenue ? `${Number(p.totalRevenue).toLocaleString('ru-RU')} so'm` : '—',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
    })

    finalY = doc.lastAutoTable.finalY + 10
  }

  // 3. Kunlik sotuvlar jadvali
  if (dailySales.length > 0) {
    if (finalY > 220) {
      doc.addPage()
      finalY = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text('Kunlik sotuvlar dinamikasi', 14, finalY)

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Sana', 'Buyurtmalar soni', 'Tushum']],
      body: dailySales.map((s) => [
        s.date || s._id || '—',
        `${s.ordersCount || s.count || 0} ta`,
        `${Number(s.totalRevenue || s.revenue || 0).toLocaleString('ru-RU')} so'm`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
    })
  }

  doc.save(filename)
}
