# RestoFlow — Jamoa Vazifalari (Team Task Assignments)

> **Muddatlar:**
> - **P0:** 18-Avgust (Bugun)
> - **P1:** 21-Avgust
> - **P2:** 25-Avgust
> - **Demo:** Juma 17:00

---

## Vazifalar taqsimoti

| Dasturchi | Modullar & Papkalar | Asosiy Vazifalar | Ustuvorlik |
|-----------|--------------------|-------------------|------------|
| 🟢 **Zulfiqor** | `build`, `docs/EVENTS.md`, `backend agreements` | Build fix (100% yashil), Socket eventlar shartnomasi (`EVENTS.md`), backend kelishuvlari, `TASKS.md` sinxronizatsiyasi | **P0** |
| 🔵 **Ziyodilla** | `features/kitchen`, `features/tables`, `features/orders` | Oshxona paneli + Stollar/Ofitsiant moduli (Abdugani integratsiyasi), socket lifecycle bug fiх | **P0 / P1** |
| 🟣 **Izzat** | `features/menu`, `features/qr-menu` | Menyu (localStorage → API o'tkazish, ruscha → o'zbekcha, ₽ → so'm o'g'irish, maxsus CSS → Tailwind'ga o'tkazish) | **P1** |
| 🟠 **Fayoz** | `features/notifications`, `features/cashier` | Bildirishnomalarni backendga ulash + Kassa paneli (Madinaning branch'da qolgan ~1460 qator kodini `main`ga birlashtirish) | **P1** |
| 🟤 **Abdurahmon** | `infra`, `ci`, `store/`, `api/` | GitHub Actions CI (build/test har PR'da otilishi), ikkita store va ikkita API qatlamini yagona standartga keltirish | **P1 / P2** |

---

## Batafsil Topshiriqlar

### 🟢 Zulfiqor — Build & Event Standartlari (P0)
- [x] **Build Fix:** Frontend `npm run build` hamda Backend `npm test` 100% yashil o'tishini ta'minlash (`OrdersPage.jsx` JSX va sintaksis xatolari tuzatildi).
- [x] **EVENTS.md:** Backend va Frontend o'rtasidagi barcha Socket.io eventlarining yagona kanonik hujjatini yaratish (`docs/EVENTS.md`).
- [x] **Order Cancellation:** Buyurtmani bekor qilish (`bekor_qilingan` statusi va `/orders/:id/cancel` API) backend hamda UI darajasida to'liq ishlatish.
- [x] **TASKS.md Sync:** Barcha jamoa a'zolari uchun vazifalarni GitHub repo'siga push qilish.

### 🔵 Ziyodilla — Oshxona & Stollar Integratsiyasi (P0 / P1)
- [x] Oshxona panelini real `/orders` API endpointiga ulash.
- [ ] Stollar hamda Ofitsiant panelidagi socket ulanishlari aylanasini (lifecycle bug) bartaraf etish.
- [ ] Abdugani modulini stollar va buyurtmalar bilan to'liq integratsiya qilish.

### 🟣 Izzat — Menyu Standartizatsiyasi (P1)
- [ ] Menyu ma'lumotlarini localStorage'dan to'liq chiqarib, real API so'rovlariga o'tkazish.
- [ ] Barcha matnlarni ruschadan o'zbekchaga o'tkazish.
- [ ] Valyuta belgisini ₽ (rubl) dan **so'm**ga o me'yorlashtirish.
- [ ] Eskirgan `MenuPage.css` va moslashtirilgan CSS'larni sof Tailwind CSS klasslariga o'tkazish.

### 🟠 Fayoz — Bildirishnomalar & Kassa Integratsiyasi (P1)
- [ ] Real-time bildirishnomalarni (notifications) backend socket va API'ga ulash.
- [ ] Madinaning alohida branch'ida qolib ketgan ~1460 qator kassa va dashboard kodlarini ko'rib chiqish hamda `main`ga muvaffaqiyatli merge qilish.

### 🟤 Abdurahmon — CI/CD & Arxitektura Birlashtirish (P1 / P2)
- [ ] GitHub Actions CI workflow sozlash (har bir Pull Request'da `npm test` va `npm run build` avtomatik tekshirilishi).
- [ ] Loyihadagi dublikat 2 xil store va 2 xil API qatlamlarini (Zustand + Redux / services vs features api) yagona standartga keltirish.

---

## Definition of Done ("Tayyor" Mezoni)
1. Kod barcha lint va build tekshiruvlaridan o'tgan (`npm run build` prodyuser xatosiz).
2. Backend va Frontend integratsiyasi real API va socket eventlar orqali ishlaydi.
3. Yangi o'zgarishlar tegishli PR (Pull Request) orqali review qilinib `main`ga merge qilingan.
