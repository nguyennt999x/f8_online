export type OrderStatus = 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy' | 'Chờ xác nhận';

export interface Order {
  id: string;
  customerName: string;
  productName: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
}
