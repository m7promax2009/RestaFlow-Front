export const statsData = [
    { id: 1, title: "Выручка за сегодня", value: "2,450,000 UZS", change: "+12.4%", isPositive: true },
    { id: 2, title: "Активные заказы", value: "18", change: "+4.2%", isPositive: true },
    { id: 3, title: "Занятые столы", value: "12 / 20", change: "60% загрузка", isPositive: true },
    { id: 4, title: "Средний чек", value: "136,000 UZS", change: "-1.8%", isPositive: false }
  ];
  
  export const chartData = {
    categories: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
    series: [{ name: "Выручка (UZS)", data: [450000, 890000, 1200000, 950000, 1400000, 2100000, 1850000, 600000] }]
  };
  
  export const recentOrders = [
    { id: "1024", table: "Стол №5", waiter: "Алишер", total: "245,000 UZS", status: "Preparing" },
    { id: "1025", table: "Стол №12", waiter: "Сардор", total: "112,000 UZS", status: "Ready" },
    { id: "1026", table: "Стол №2", waiter: "Дилноза", total: "560,000 UZS", status: "Paid" }
  ];
  