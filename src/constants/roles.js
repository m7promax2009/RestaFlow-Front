export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  WAITER: 'waiter',
  CHEF: 'cook',
  CASHIER: 'cashier',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Menejer',
  [ROLES.WAITER]: 'Ofitsiant',
  [ROLES.CHEF]: 'Oshpaz',
  [ROLES.CASHIER]: 'Kassir',
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