import { useEffect, useState } from 'react';
import { CreditCard, DollarSign, Smartphone, Printer, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { getReceipt, processPayment } from '../../../services/cashierService';

// TODO: Orders feature (Abdugani) route orqali orderId berishi kerak, masalan
// /cashier/:orderId -> useParams(). Hozircha Orders route mavjud emas,
// shuning uchun vaqtincha shu ID bilan chek so'raymiz.
const PLACEHOLDER_ORDER_ID = "ORD-1042";

const mockOrder = {
  id: "ORD-1042",
  table: "Stol #5",
  waiter: "Ali",
  items: [
    { name: "Osh (To'liq)", price: 45000, qty: 2 },
    { name: "Shashlik (Mol)", price: 18000, qty: 4 },
    { name: "Limon Choy", price: 12000, qty: 1 },
    { name: "Non", price: 4000, qty: 2 },
  ]
};

export default function Cashier() {
  const [order, setOrder] = useState(mockOrder);
  const [usingMock, setUsingMock] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [splitCount, setSplitCount] = useState(1);
  const [paid, setPaid] = useState(false);
  const [paymentRecorded, setPaymentRecorded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReceipt() {
      try {
        const res = await getReceipt(PLACEHOLDER_ORDER_ID);
        if (!cancelled && res.data?.data) {
          setOrder(res.data.data);
          setUsingMock(false);
        }
      } catch (err) {
        // Token/ruxsat yo'q yoki bu ID bo'yicha buyurtma topilmadi — mock bilan davom etamiz.
        console.info("Cashier: chek real API'dan olinmadi, mock ko'rsatilmoqda.", err?.response?.status ?? err?.message);
      }
    }

    loadReceipt();
    return () => { cancelled = true; };
  }, []);

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const serviceTax = subtotal * 0.1; // 10% xizmat haqi
  const totalAmount = subtotal + serviceTax;
  const splitAmount = totalAmount / splitCount;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      await processPayment({
        orderId: order.id,
        amount: totalAmount,
        method: paymentMethod,
        splitCount,
      });
      setPaymentRecorded(true);
    } catch (err) {
      // Serverga yozilmadi (ruxsat/tarmoq muammosi) — baribir mahalliy holatda davom etamiz.
      console.info("Cashier: to'lov serverga yozilmadi.", err?.response?.status ?? err?.message);
      setPaymentRecorded(false);
    } finally {
      setSubmitting(false);
      setPaid(true);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chap Qism: Buyurtma va Split Bill */}
      <div className="lg:col-span-2 space-y-6">
        {usingMock && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Hozircha namunaviy (mock) buyurtma ko'rsatilmoqda — real buyurtma ID'si ulanganda avtomatik almashadi.
          </div>
        )}
        <div className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold">{order.table}</h2>
              <p className="text-xs text-slate-500">Buyurtma ID: {order.id} | Ofitsiant: {order.waiter}</p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full">
              Kutilmoqda
            </span>
          </div>

          {/* Mahsulotlar ro'yxati */}
          <div className="divide-y divide-slate-100">
            {order.items.map((item, index) => (
              <div key={index} className="py-3 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.qty} x {item.price.toLocaleString()} so'm</p>
                </div>
                <span className="font-semibold">{(item.qty * item.price).toLocaleString()} so'm</span>
              </div>
            ))}
          </div>

          {/* Split Bill bo'limi */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Hisobni bo'lish (Split Bill):</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setSplitCount(num)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    splitCount === num ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  {num} kishi
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* O'ng Qism: To'lov Oynasi & Chek */}
      <div className="space-y-6">
        <div className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm space-y-5">
          <h3 className="text-lg font-bold border-b pb-3">To'lov Usuli</h3>

          {/* To'lov usullari */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'card', name: 'Karta', icon: CreditCard },
              { id: 'cash', name: 'Naqd', icon: DollarSign },
              { id: 'click', name: 'Click', icon: Smartphone },
              { id: 'payme', name: 'Payme', icon: Smartphone },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition ${
                    paymentMethod === method.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{method.name}</span>
                </button>
              );
            })}
          </div>

          {/* Hisob-kitob summary */}
          <div className="space-y-2 pt-3 border-t text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Oraliq jami:</span>
              <span>{subtotal.toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Xizmat haqi (10%):</span>
              <span>{serviceTax.toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t">
              <span>Jami:</span>
              <span>{totalAmount.toLocaleString()} so'm</span>
            </div>
            {splitCount > 1 && (
              <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                <span>Har bir kishiga ({splitCount}):</span>
                <span>{splitAmount.toLocaleString()} so'm</span>
              </div>
            )}
          </div>

          {/* To'lov va Chek tugmalari */}
          {!paid ? (
            <button
              onClick={handleConfirmPayment}
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-xl transition shadow-sm"
            >
              {submitting ? "Yuborilmoqda..." : "To'lovni tasdiqlash"}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                <CheckCircle className="w-5 h-5" /> To'lov amalga oshirildi!
              </div>
              {!paymentRecorded && (
                <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Diqqat: to'lov serverga yozilmadi (ruxsat yoki ulanish muammosi), faqat mahalliy holatda ko'rsatilmoqda.
                </div>
              )}
              <button
                onClick={handlePrintReceipt}
                className="w-full py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" /> Chek Chop Etish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
