# RestoFlow — MVP Sprint (20–25 avgust 2026)

> Bu ro'yxat **kod holatidan** tuzilgan, notadan emas.
> Tekshirilgan: frontend `main` = merge qilingan (build ✅), backend `main` = `0fb2e30` (98/98 test ✅).
> Lokal ishlaydi: backend `:3000`, frontend `:5173`. `.env` to'liq (CORS, Telegram, SMTP, Supabase).

**Muddatlar:**
- **P0 — 22-avgust (shanba) 18:00** — bularsiz MVP yo'q
- **P1 — 24-avgust (dushanba) 18:00**
- **MVP DEMO — 25-avgust (seshanba) 17:00**

**Qoida:** har kim `feature/<ism>-<modul>` branch'ida ishlaydi, kuniga kamida 1 marta push.
PR ochishdan oldin `npm run build` (frontend) va `npm test` (backend) yashil bo'lishi shart.

---

## Vazifalar taqsimoti

| Kim | Modul | Vazifa | Ustuvorlik |
|-----|-------|--------|------------|
| 🟢 **Zulfiqor** | lead, integratsiya | Kunlik merge, PR review, demo ssenariysi, Telegram hisobot | P0 |
| 🟣 **Izzat** | `features/menu`, `features/qr-menu` | Menyuni localStorage'dan API'ga ko'chirish + QR mehmon buyurtmasi | **P0** |
| 🟤 **Madina** | `features/cashier` | Smena ochish/yopish + Z-Report UI | **P0** |
| 🔵 **Ziyodilla** | `features/orders`, `features/tables` | «Ofitsiant chaqirish» real-time oqimi | **P0** |
| 🟠 **Fayoz** | `features/kitchen`, `features/notifications` | Mock fallback'ni olib tashlash, bildirishnomalar to'liq ulanishi | P1 |
| ⚫ **Abdurahmon** | `infra`, backend `settings` | GitHub Actions CI + Sozlamalar API'si | P1 |

---

## 🟣 Izzat — Menyu + QR mehmon buyurtmasi (P0)

**Muammo:** `features/menu/pages/MenuPage.jsx` butun menyuni `localStorage`da saqlaydi (64–267-qatorlar), rasmlarni base64 qilib kvotani to'ldiradi, matnlari ruscha. Backend allaqachon tayyor.

- [ ] `MenuPage.jsx` dan **butun localStorage qatlamini olib tashlash**. Kategoriya CRUD → `/api/categories`, taom CRUD → `/api/products` (react-query `useMutation` + `invalidateQueries`).
- [ ] Rasm yuklash: base64 emas, `POST /api/products` ga `multipart/form-data` — backend Supabase Storage'ga o'zi yuklaydi (`.env` da `SUPABASE_SERVICE_KEY` bor, ishlaydi).
- [ ] Barcha ruscha matn va izohlarni o'zbekchaga, `₽` → **so'm**.
- [ ] `MenuPage.css` qoldiqlarini Tailwind'ga o'tkazish.
- [ ] **QR mehmon buyurtmasi:** `features/qr-menu/api.js` da hozir faqat `createGuestReservation` bor. `createGuestOrder` qo'shish → `POST /api/orders` (stol raqami QR'dan, `items` savatdan). `GuestMenuPage.jsx` da savat → tasdiqlash → buyurtma oqimi.

**Tayyor mezoni:** telefonda `/guest?table=5` ochib, taom tanlab, buyurtma berasan — oshxona panelida (`/kitchen`) o'sha buyurtma **sahifani yangilamasdan** paydo bo'ladi.

---

## 🟤 Madina — Smena va Z-Report (P0)

**Muammo:** backendda `/api/shifts` to'liq tayyor (`open`, `current`, `close`, ro'yxat + testlar), frontendda **umuman yo'q**. Smenasiz kassa yopilmaydi — MVP demo shu yerda uziladi.

- [ ] `features/cashier/api.js` ga: `openShift`, `getCurrentShift`, `closeShift`, `getShifts`.
- [ ] Kassa sahifasi tepasiga smena holati paneli: yopiq bo'lsa «Smenani ochish» (boshlang'ich naqd summa), ochiq bo'lsa — ochilgan vaqti, kassir ismi, joriy tushum.
- [ ] «Smenani yopish» modali → `POST /shifts/close` → qaytgan **Z-Report**ni ko'rsatish: naqd/karta bo'yicha summa, buyurtmalar soni, kutilgan va haqiqiy naqd farqi.
- [ ] Z-Report'ni chop etish (mavjud `ReceiptModal` chop etish mantiqidan foydalan).
- [ ] Smena ochilmagan bo'lsa to'lov qabul qilishni bloklash.

**Tayyor mezoni:** smena ochasan → 2 ta buyurtmani to'laysan → smenani yopasan → Z-Report'da o'sha 2 to'lov summasi to'g'ri chiqadi.

---

## 🔵 Ziyodilla — «Ofitsiant chaqirish» oqimi (P0)

**Muammo:** backend `POST /api/tables/:id/call-waiter` ni bajaradi, `table:waiter_called` eventini emit qiladi va notification yaratadi — lekin **frontendda bu eventni hech kim tinglamaydi**. Ya'ni funksiya bor, ko'rinmaydi.

- [ ] `features/qr-menu` ga mehmon uchun 3 ta tugma: «Ofitsiantni chaqirish», «Chek — naqd», «Chek — karta» → `POST /tables/:id/call-waiter` (`type: call | bill_cash | bill_card`).
- [ ] `WaiterPage.jsx` da `socket.on('table:waiter_called')` — ekranning tepasida qizil banner + ovozli signal (`useKitchenOrders.js` dagi `playAudioAlert` ni umumiy `utils`ga chiqarib qayta ishlat).
- [ ] `TablesPage.jsx` da chaqirgan stol yonib tursin, ofitsiant «Qabul qildim» bosgach o'chsin.
- [ ] Stollar/Ofitsiant sahifalaridagi socket lifecycle bug: komponent remount bo'lganda listener ikki marta osilib qolmasin (`useNotificationsSocket.js` dagi pattern namuna).

**Tayyor mezoni:** mehmon telefonidan chaqirasan → ofitsiant ekranida 2 soniya ichida signal + banner chiqadi.

---

## 🟠 Fayoz — Oshxona va bildirishnomalar (P1)

- [ ] `features/kitchen/mockData.js` va undan kelayotgan `demo` rejimni olib tashlash — backend yiqilsa mock ko'rsatish o'rniga aniq xato holati ko'rsatilsin.
- [ ] `useKitchenOrders.js` dagi `order:created` / `order:status_updated` / `kitchen:new_order` eventlarini `EVENTS.md` ga solishtirib tekshirish (merge paytida qo'lda birlashtirilgan — sinovdan o'tkazish kerak).
- [ ] Bildirishnomalar: `notificationsSlice.js` dagi mock ma'lumotni olib tashlab `/api/notifications` ga to'liq ulash, o'qilgan/o'qilmagan holati backendda saqlansin.
- [ ] Sidebar'dagi bell ikonkasiga o'qilmaganlar soni.

---

## ⚫ Abdurahmon — CI va Sozlamalar (P1)

- [ ] **CI:** `.github/workflows/ci.yml` — hozir repo'da `.github` papkasi umuman yo'q. Har PR'da: frontend `npm ci && npm run build`, backend `npm ci && npm test`. Yiqilsa merge bloklansin.
- [ ] **Sozlamalar backendi:** `features/settings/pages/SettingsPage.jsx` hamma narsani `localStorage`da saqlaydi (restoran nomi, soliq %, xizmat haqi %, printer). Backendda `Settings` modeli + `GET/PUT /api/settings` (faqat admin/manager) yozish.
- [ ] Frontendni o'sha API'ga ulash va **soliq/xizmat foizini chekda haqiqiy hisobga** olish (hozir chekda qattiq yozilgan qiymat ishlatilyapti).

---

## 🟢 Zulfiqor — Lead (P0, doimiy)

- [ ] Har kuni 18:00 da PR'larni merge qilish, konfliktlarni yechish.
- [ ] `main` doim yashil turishini kuzatish (build + test).
- [ ] Demo ssenariysi (25-avgust): QR'dan buyurtma → oshxona → ofitsiant → kassa → smena yopish → Telegram'ga hisobot.
- [ ] Telegram bot: kunlik hisobot avtomatik 23:00 da ketishini tekshirish.

---

## Merge'dan keyin qolgan quyruqlar (kim tegib ketsa — tuzatsin)

- `Dashboard.jsx` da `getReports()` o'chirildi (backendda `GET /reports` yo'q), `getDashboardStats()` ishlatilyapti.
- `EmployeesPage.jsx` ga Audit log tab'i qaytarildi — permission tekshiruvi bilan sinash kerak.
- `AttendanceTable` / `AuditLogPage` endi real API'da — bo'sh ma'lumotda ko'rinishini tekshirish kerak.
- Backend `transferTable` ga socket emit qo'shildi (stol ko'chirilganda real-time yangilanish).
