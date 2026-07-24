// Foydalanuvchi rollari — butun ilova bo'ylab ishlatiladi.
// Qiymatlar backend User modeli bilan bir xil bo'lishi shart (src/models/User.js).
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  WAITER: 'waiter',
  CASHIER: 'cashier',
  COOK: 'cook',
  // Alias — Abdurahmon kodi CHEF ishlatadi (COOK bilan bir xil qiymat).
  CHEF: 'cook',
}

// Har bir rol login qilgandan keyin qayerga tushishi kerak.
export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.MANAGER]: '/manager',
  [ROLES.WAITER]: '/waiter',
  [ROLES.CASHIER]: '/cashier',
  [ROLES.COOK]: '/kitchen',
}

// Sidebar va profil uchun inson o'qiy oladigan nomlar (o'zbekcha).
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Menejer',
  [ROLES.WAITER]: 'Ofitsiant',
  [ROLES.CASHIER]: 'Kassir',
  [ROLES.COOK]: 'Oshpaz',
}

export const ORDER_STATUS = {
  NEW: 'new',
  IN_KITCHEN: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CLOSED: 'closed',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.NEW]: 'Yangi',
  [ORDER_STATUS.IN_KITCHEN]: 'Oshxonada',
  [ORDER_STATUS.READY]: 'Tayyor',
  [ORDER_STATUS.SERVED]: 'Berildi',
  [ORDER_STATUS.CLOSED]: 'Yopilgan',
}

export const TABLE_STATUS = {
  FREE: 'available',
  BUSY: 'occupied',
  RESERVED: 'reserved',
}

export const TABLE_STATUS_LABELS = {
  [TABLE_STATUS.FREE]: "Bo'sh",
  [TABLE_STATUS.BUSY]: 'Band',
  [TABLE_STATUS.RESERVED]: 'Bron qilingan',
}