// Foydalanuvchi rollari — butun ilova bo'ylab ishlatiladi.
// Qiymatlar backend User modeli bilan bir xil bo'lishi shart (src/models/User.js).
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  WAITER: 'waiter',
  CASHIER: 'cashier',
  COOK: 'cook',
}

// Har bir rol login qilgandan keyin qayerga tushishi kerak.
export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.MANAGER]: '/manager',
  [ROLES.WAITER]: '/waiter',
  [ROLES.CASHIER]: '/cashier',
  [ROLES.COOK]: '/kitchen',
}

// Sidebar va profil uchun inson o'qiy oladigan nomlar.
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Администратор',
  [ROLES.MANAGER]: 'Менеджер',
  [ROLES.WAITER]: 'Официант',
  [ROLES.CASHIER]: 'Кассир',
  [ROLES.COOK]: 'Повар',
}

// Buyurtma statuslari (backend bilan bir xil)
export const ORDER_STATUS = {
  NEW: 'yangi',
  IN_KITCHEN: 'oshxonada',
  READY: 'tayyor',
  SERVED: 'berildi',
  CLOSED: 'yopilgan',
}

// Stol holatlari
export const TABLE_STATUS = {
  FREE: 'bo\'sh',
  BUSY: 'band',
  RESERVED: 'bron',
}
