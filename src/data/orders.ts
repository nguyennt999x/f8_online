import { Order, OrderStatus } from '../types/order';

const statuses: OrderStatus[] = ['Hoàn thành', 'Đang xử lý', 'Đã hủy', 'Chờ xác nhận'];
const customerNames = [
  'Nguyen Van An',
  'Tran Thi Bich',
  'Le Hoang Minh',
  'Pham Gia Bao',
  'Do Thu Trang',
  'Vo Quoc Huy',
  'Bui Khanh Linh',
  'Dang Tuan Kiet',
  'Phan Ngoc Han',
  'Hoang Duc Anh',
];
const productNames = [
  'Khoa hoc ReactJS',
  'Khoa hoc NodeJS',
  'Khoa hoc HTML CSS',
  'Khoa hoc JavaScript Pro',
  'Khoa hoc NextJS',
  'Khoa hoc TypeScript',
  'Combo Front-end',
  'Combo Back-end',
];

export const orders: Order[] = Array.from({ length: 200 }, (_, index) => {
  const month = ((index * 3) % 12) + 1;
  const day = ((index * 7) % 28) + 1;
  const status = statuses[index % statuses.length];
  const amount = 250000 + ((index * 137000) % 3250000);

  return {
    id: `ORD-${String(index + 1).padStart(4, '0')}`,
    customerName: customerNames[index % customerNames.length],
    productName: productNames[index % productNames.length],
    orderDate: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    totalAmount: amount,
    status,
  };
});
